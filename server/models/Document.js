const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true },
    fileType: { type: String }, // PDF, Image, etc.
    department: { type: String, required: true },
    complianceType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    expiryDate: { type: Date },
    approvalComments: { type: String },
    history: [{
        status: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
