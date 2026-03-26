const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// Configure Multer for file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype) || file.mimetype.includes('document') || file.mimetype.includes('sheet') || file.mimetype.includes('pdf');
        if (ext || mime) {
            cb(null, true);
        } else {
            cb(new Error('Only documents and images are allowed'));
        }
    }
});

// @desc    Get document stats for dashboard
// @route   GET /api/documents/stats
router.get('/stats', protect, async (req, res, next) => {
    try {
        const total = await Document.countDocuments();
        const approved = await Document.countDocuments({ status: 'Approved' });
        const pending = await Document.countDocuments({ status: 'Pending' });
        const rejected = await Document.countDocuments({ status: 'Rejected' });

        // Documents expiring in next 90 days
        const now = new Date();
        const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        const expiring = await Document.countDocuments({
            expiryDate: { $gte: now, $lte: ninetyDays }
        });

        // Monthly upload trend (last 6 months)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyTrend = await Document.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthNum = d.getMonth() + 1;
            const found = monthlyTrend.find(m => m._id === monthNum);
            trendData.push({
                name: monthNames[d.getMonth()],
                value: found ? found.count : 0
            });
        }

        // Department distribution
        const deptDist = await Document.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        res.json({
            total,
            approved,
            pending,
            rejected,
            expiring,
            trendData,
            departmentData: deptDist.map(d => ({ dept: d._id, docs: d.count })),
            statusData: [
                { name: 'Approved', value: approved, color: '#10b981' },
                { name: 'Pending', value: pending, color: '#f59e0b' },
                { name: 'Rejected', value: rejected, color: '#ef4444' }
            ]
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get expiring documents
// @route   GET /api/documents/expiring
router.get('/expiring', protect, async (req, res, next) => {
    try {
        const now = new Date();
        const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

        const docs = await Document.find({
            expiryDate: { $ne: null, $gte: now, $lte: ninetyDays }
        })
            .populate('uploadedBy', 'name email')
            .sort({ expiryDate: 1 });

        const result = docs.map(doc => {
            const daysLeft = Math.ceil((new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24));
            let severity = 'info';
            if (daysLeft <= 14) severity = 'critical';
            else if (daysLeft <= 30) severity = 'warning';

            return {
                _id: doc._id,
                name: doc.name,
                department: doc.department,
                expiryDate: doc.expiryDate,
                daysLeft,
                severity,
                complianceType: doc.complianceType,
                status: doc.status,
                uploadedBy: doc.uploadedBy
            };
        });

        // Also include already expired documents
        const expired = await Document.find({
            expiryDate: { $ne: null, $lt: now }
        })
            .populate('uploadedBy', 'name email')
            .sort({ expiryDate: -1 })
            .limit(10);

        const expiredResult = expired.map(doc => {
            const daysLeft = Math.ceil((new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24));
            return {
                _id: doc._id,
                name: doc.name,
                department: doc.department,
                expiryDate: doc.expiryDate,
                daysLeft,
                severity: 'expired',
                complianceType: doc.complianceType,
                status: doc.status,
                uploadedBy: doc.uploadedBy
            };
        });

        res.json([...result, ...expiredResult]);
    } catch (error) {
        next(error);
    }
});

// @desc    Get all documents
// @route   GET /api/documents
router.get('/', protect, async (req, res, next) => {
    try {
        const { search, status, department, complianceType } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { complianceType: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        if (department) query.department = department;
        if (complianceType) query.complianceType = complianceType;

        const docs = await Document.find(query)
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(docs);
    } catch (error) {
        next(error);
    }
});

// @desc    Get single document
// @route   GET /api/documents/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id)
            .populate('uploadedBy', 'name email')
            .populate('history.updatedBy', 'name');

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(doc);
    } catch (error) {
        next(error);
    }
});

// @desc    Upload / create document
// @route   POST /api/documents
router.post('/', protect, authorize('Admin', 'Staff'), upload.single('file'), async (req, res, next) => {
    try {
        const { name, description, department, complianceType, expiryDate } = req.body;

        if (!name || !department || !complianceType) {
            return res.status(400).json({ message: 'Name, department, and compliance type are required' });
        }

        const docData = {
            name,
            description: description || '',
            department,
            complianceType,
            uploadedBy: req.user._id,
            status: 'Pending',
            expiryDate: expiryDate || null,
            filePath: req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.pdf',
            fileType: req.file ? path.extname(req.file.originalname).replace('.', '').toUpperCase() : 'PDF',
            history: [{
                status: 'Pending',
                updatedBy: req.user._id,
                timestamp: new Date()
            }]
        };

        const doc = await Document.create(docData);

        await AuditLog.create({
            action: 'Document Uploaded',
            user: req.user._id,
            userName: req.user.name,
            target: doc.name,
            targetDoc: doc._id,
            details: `${req.user.name} uploaded ${doc.name} to ${doc.department}`
        });

        const populated = await Document.findById(doc._id).populate('uploadedBy', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        next(error);
    }
});

// @desc    Update document
// @route   PUT /api/documents/:id
router.put('/:id', protect, authorize('Admin', 'Staff'), async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== 'uploadedBy') {
                doc[key] = updates[key];
            }
        });

        await doc.save();

        await AuditLog.create({
            action: 'Document Updated',
            user: req.user._id,
            userName: req.user.name,
            target: doc.name,
            targetDoc: doc._id,
            details: `${req.user.name} updated ${doc.name}`
        });

        const populated = await Document.findById(doc._id).populate('uploadedBy', 'name email');
        res.json(populated);
    } catch (error) {
        next(error);
    }
});

// @desc    Approve document
// @route   PUT /api/documents/:id/approve
router.put('/:id/approve', protect, authorize('Admin', 'Staff', 'Auditor'), async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        doc.status = 'Approved';
        doc.approvalComments = req.body.comments || 'Approved';
        doc.history.push({
            status: 'Approved',
            updatedBy: req.user._id,
            timestamp: new Date()
        });

        await doc.save();

        await AuditLog.create({
            action: 'Document Approved',
            user: req.user._id,
            userName: req.user.name,
            target: doc.name,
            targetDoc: doc._id,
            details: `${req.user.name} approved ${doc.name}`
        });

        const populated = await Document.findById(doc._id).populate('uploadedBy', 'name email');
        res.json(populated);
    } catch (error) {
        next(error);
    }
});

// @desc    Reject document
// @route   PUT /api/documents/:id/reject
router.put('/:id/reject', protect, authorize('Admin', 'Staff', 'Auditor'), async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        doc.status = 'Rejected';
        doc.approvalComments = req.body.comments || 'Rejected';
        doc.history.push({
            status: 'Rejected',
            updatedBy: req.user._id,
            timestamp: new Date()
        });

        await doc.save();

        await AuditLog.create({
            action: 'Document Rejected',
            user: req.user._id,
            userName: req.user.name,
            target: doc.name,
            targetDoc: doc._id,
            details: `${req.user.name} rejected ${doc.name}: ${req.body.comments || 'No reason'}`
        });

        const populated = await Document.findById(doc._id).populate('uploadedBy', 'name email');
        res.json(populated);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
router.delete('/:id', protect, authorize('Admin', 'Staff'), async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const docName = doc.name;

        // Delete the physical file if it exists
        if (doc.filePath) {
            const filePath = path.join(__dirname, '..', doc.filePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Document.findByIdAndDelete(req.params.id);

        await AuditLog.create({
            action: 'Document Deleted',
            user: req.user._id,
            userName: req.user.name,
            target: docName,
            details: `${req.user.name} deleted ${docName}`
        });

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// @desc    Download document
// @route   GET /api/documents/:id/download
router.get('/:id/download', protect, async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const filePath = path.join(__dirname, '..', doc.filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath, doc.name);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
