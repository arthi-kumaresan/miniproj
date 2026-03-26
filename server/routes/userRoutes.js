const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all users
// @route   GET /api/users
router.get('/', protect, authorize('Admin'), async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// @desc    Create user (Admin only)
// @route   POST /api/users
router.post('/', protect, authorize('Admin'), async (req, res, next) => {
    try {
        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Viewer',
            department: department || 'General'
        });

        await AuditLog.create({
            action: 'User Created',
            user: req.user._id,
            userName: req.user.name,
            target: `${user.name} (${user.role})`,
            details: `${req.user.name} created user ${user.name} with role ${user.role}`
        });

        const result = await User.findById(user._id).select('-password');
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
router.put('/:id', protect, authorize('Admin'), async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, role, department, password } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (department) user.department = department;
        if (password) user.password = password;

        await user.save();

        await AuditLog.create({
            action: 'User Updated',
            user: req.user._id,
            userName: req.user.name,
            target: `${user.name} (${user.role})`,
            details: `${req.user.name} updated user ${user.name}`
        });

        const result = await User.findById(user._id).select('-password');
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
router.delete('/:id', protect, authorize('Admin'), async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const userName = user.name;
        await User.findByIdAndDelete(req.params.id);

        await AuditLog.create({
            action: 'User Deleted',
            user: req.user._id,
            userName: req.user.name,
            target: userName,
            details: `${req.user.name} deleted user ${userName}`
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
