const User = require('../models/User');

// @desc    Get all active users (optionally filter by role)
// @route   GET /api/users?role=developer
// @access  Admin
const getUsers = async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.role) filter.role = req.query.role;
        const users = await User.find(filter).populate('teamLeaderId', 'name userId email');
        res.json({ success: true, count: users.length, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin / Self
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('teamLeaderId', 'name userId email');
        if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create Team Leader
// @route   POST /api/users/create-tl
// @access  Admin
const createTeamLeader = async (req, res) => {
    try {
        const { name, email, phone, userId, password } = req.body;

        const exists = await User.findOne({ $or: [{ email }, { userId: userId.toUpperCase() }] });
        if (exists) return res.status(400).json({ success: false, error: 'Email or User ID already exists.' });

        const tl = await User.create({ name, email, phone, userId: userId.toUpperCase(), password, role: 'teamleader' });
        res.status(201).json({ success: true, user: tl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create Developer and assign to TL
// @route   POST /api/users/create-dev
// @access  Admin
const createDeveloper = async (req, res) => {
    try {
        const { name, email, phone, userId, password, teamLeaderId } = req.body;

        const tl = await User.findById(teamLeaderId);
        if (!tl || tl.role !== 'teamleader') {
            return res.status(400).json({ success: false, error: 'Invalid Team Leader ID.' });
        }

        const exists = await User.findOne({ $or: [{ email }, { userId: userId.toUpperCase() }] });
        if (exists) return res.status(400).json({ success: false, error: 'Email or User ID already exists.' });

        const dev = await User.create({ name, email, phone, userId: userId.toUpperCase(), password, role: 'developer', teamLeaderId });
        res.status(201).json({ success: true, user: dev });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete user (Soft delete)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
        user.isActive = false;
        await user.save();
        res.json({ success: true, message: 'User deactivated successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get active developers under a Team Leader
// @route   GET /api/users/my-team
// @access  TL
const getMyTeam = async (req, res) => {
    try {
        const devs = await User.find({ teamLeaderId: req.user._id, role: 'developer', isActive: true });
        res.json({ success: true, count: devs.length, users: devs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getUsers, getUserById, createTeamLeader, createDeveloper, deleteUser, getMyTeam };
