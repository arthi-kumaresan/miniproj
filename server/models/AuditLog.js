const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String },
    target: { type: String },
    targetDoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    details: { type: String },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
