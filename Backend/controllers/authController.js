const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { userId, password, role } = req.body;

        if (!userId || !password || !role) {
            return res.status(400).json({ success: false, error: 'Please provide userId, password, and role.' });
        }

        const user = await User.findOne({ userId: userId.toUpperCase(), role, isActive: true }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials, role mismatch, or account disabled.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials or role mismatch.' });
        }

        const token = generateToken({ id: user._id, role: user.role });

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userId: user.userId,
                role: user.role,
                teamLeaderId: user.teamLeaderId,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Register seed admin (run once)
// @route   POST /api/auth/register
// @access  Public (but should be restricted in prod)
const register = async (req, res) => {
    try {
        const { name, email, phone, userId, password, role, teamLeaderId } = req.body;

        const exists = await User.findOne({ $or: [{ email }, { userId: userId.toUpperCase() }] });
        if (exists) {
            return res.status(400).json({ success: false, error: 'Email or User ID already exists.' });
        }

        const user = await User.create({ name, email, phone, userId: userId.toUpperCase(), password, role, teamLeaderId: teamLeaderId || null });
        const token = generateToken({ id: user._id, role: user.role });

        res.status(201).json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { login, getMe, register };
