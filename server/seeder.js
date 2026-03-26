const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Document = require('./models/Document');
const AuditLog = require('./models/AuditLog');

dotenv.config();

const users = [
    { name: 'Admin Administrator', email: 'admin@compliance.com', password: 'admin123', role: 'Admin', department: 'IT' },
    { name: 'Sarah Compliance', email: 'staff@compliance.com', password: 'staff123', role: 'Staff', department: 'Legal' },
    { name: 'Mike Auditor', email: 'auditor@compliance.com', password: 'auditor123', role: 'Auditor', department: 'Finance' },
    { name: 'Emma Viewer', email: 'viewer@compliance.com', password: 'viewer123', role: 'Viewer', department: 'HR' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/compliance_vault');
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Document.deleteMany({});
        await AuditLog.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        const admin = createdUsers[0];
        const staff = createdUsers[1];

        // Create sample documents
        const docs = [
            {
                name: 'Network_Security_Audit_2024.pdf',
                description: 'Complete network vulnerability assessment',
                filePath: '/uploads/network_audit.pdf',
                fileType: 'PDF',
                department: 'IT',
                complianceType: 'Certificate',
                uploadedBy: staff._id,
                status: 'Approved',
                expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Financial_Quarterly_Report_Q1.xlsx',
                description: 'Q1 2024 Financial Compliance Report',
                filePath: '/uploads/finance_q1.xlsx',
                fileType: 'XLSX',
                department: 'Finance',
                complianceType: 'Report',
                uploadedBy: staff._id,
                status: 'Pending',
                expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Employee_Data_Privacy_Policy.docx',
                description: 'Internal policy for handling PII',
                filePath: '/uploads/privacy_policy.docx',
                fileType: 'DOCX',
                department: 'HR',
                complianceType: 'Policy',
                uploadedBy: staff._id,
                status: 'Approved',
                expiryDate: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000), // Expiers in over a year
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Fire_Safety_Certificate_2024.pdf',
                description: 'Building fire safety inspection result',
                filePath: '/uploads/fire_safety.pdf',
                fileType: 'PDF',
                department: 'Operations',
                complianceType: 'Certificate',
                uploadedBy: staff._id,
                status: 'Rejected',
                expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
                approvalComments: 'The certificate is from the previous year. Please provide the 2024 version.',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'ISO_9001_Quality_Manual.pdf',
                description: 'Quality management system documentation',
                filePath: '/uploads/iso_9001.pdf',
                fileType: 'PDF',
                department: 'Quality',
                complianceType: 'Manual',
                uploadedBy: staff._id,
                status: 'Approved',
                expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Critical expiry (10 days)
                createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Health_and_Safety_Guidelines.pdf',
                description: 'General workplace safety rules',
                filePath: '/uploads/safety.pdf',
                fileType: 'PDF',
                department: 'HR',
                complianceType: 'Guidelines',
                uploadedBy: staff._id,
                status: 'Pending',
                expiryDate: null,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ];

        const createdDocs = await Document.create(docs);
        console.log(`Created ${createdDocs.length} documents`);

        // Create Audit Logs
        const logs = [
            { action: 'User Login', user: admin._id, userName: admin.name, target: 'System', details: 'Administrator logged in from branch internal network' },
            { action: 'Document Uploaded', user: staff._id, userName: staff.name, target: createdDocs[0].name, targetDoc: createdDocs[0]._id, details: 'Network security certificate uploaded for annual review' },
            { action: 'Document Approved', user: admin._id, userName: admin.name, target: createdDocs[0].name, targetDoc: createdDocs[0]._id, details: 'Administrator approved network security certificate after verification' },
            { action: 'Document Uploaded', user: staff._id, userName: staff.name, target: createdDocs[1].name, targetDoc: createdDocs[1]._id, details: 'Finance report Q1 uploaded for audit' },
            { action: 'Document Rejected', user: admin._id, userName: admin.name, target: createdDocs[3].name, targetDoc: createdDocs[3]._id, details: 'Fire safety certificate rejected due to incorrect date' },
            { action: 'User Created', user: admin._id, userName: admin.name, target: staff.name, details: 'New compliance staff member account created' },
            { action: 'System Backup', user: admin._id, userName: admin.name, target: 'Database', details: 'Full database backup completed successfully' }
        ];

        await AuditLog.create(logs);
        console.log('Created Audit Logs');

        console.log('\n--- Seed Complete ---');
        console.log('Login credentials:');
        console.log('  Admin:   admin@compliance.com   / admin123');
        console.log('  Staff:   staff@compliance.com   / staff123');
        console.log('  Auditor: auditor@compliance.com / auditor123');
        console.log('  Viewer:  viewer@compliance.com  / viewer123');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
