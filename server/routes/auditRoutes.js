const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// @desc    Get audit reports / logs
// @route   GET /api/audit/reports
router.get('/reports', protect, async (req, res, next) => {
    try {
        const { limit = 20 } = req.query;
        const logs = await AuditLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        next(error);
    }
});

// @desc    Post audit remarks
// @route   POST /api/audit/remarks
router.post('/remarks', protect, async (req, res, next) => {
    try {
        const { documentId, remarks } = req.body;

        if (!documentId || !remarks) {
            return res.status(400).json({ message: 'Document ID and remarks are required' });
        }

        const doc = await Document.findById(documentId);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const log = await AuditLog.create({
            action: 'Audit Remark Added',
            user: req.user._id,
            userName: req.user.name,
            target: doc.name,
            targetDoc: doc._id,
            remarks,
            details: `${req.user.name} added remark on ${doc.name}: ${remarks}`
        });

        res.status(201).json(log);
    } catch (error) {
        next(error);
    }
});

// @desc    Get audit stats for charts
// @route   GET /api/audit/stats
router.get('/stats', protect, async (req, res, next) => {
    try {
        const now = new Date();

        // Document status distribution
        const statusDist = await Document.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusColors = { Approved: '#10b981', Pending: '#f59e0b', Rejected: '#ef4444' };
        const statusData = statusDist.map(s => ({
            name: s._id,
            value: s.count,
            color: statusColors[s._id] || '#6b7280'
        }));

        // Department distribution
        const deptDist = await Document.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);
        const deptData = deptDist.map(d => ({ dept: d._id, docs: d.count }));

        // Compliance trend (monthly compliance rate over 6 months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            const totalInMonth = await Document.countDocuments({
                createdAt: { $lte: monthEnd }
            });
            const approvedInMonth = await Document.countDocuments({
                status: 'Approved',
                createdAt: { $lte: monthEnd }
            });

            const rate = totalInMonth > 0 ? Math.round((approvedInMonth / totalInMonth) * 100) : 0;
            trendData.push({
                month: monthNames[monthStart.getMonth()],
                compliance: rate
            });
        }

        // Overall compliance score
        const totalDocs = await Document.countDocuments();
        const approvedDocs = await Document.countDocuments({ status: 'Approved' });
        const complianceScore = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

        // Recent audit logs
        const recentLogs = await AuditLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            statusData,
            deptData,
            trendData,
            complianceScore,
            totalDocs,
            auditLogs: recentLogs
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
