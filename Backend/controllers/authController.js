const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

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

// @desc    Forgot password — sends reset link via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide your email address.' });
        }

        const user = await User.findOne({ email: email.toLowerCase(), isActive: true });

        if (!user) {
            // Don't reveal whether the email exists — always return success
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            });
        }

        // Don't allow admin password resets via email
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin accounts cannot reset passwords via email. Contact IT support.',
            });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Build reset URL (points to the frontend)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        // Send the email
        await sendPasswordResetEmail({
            email: user.email,
            name: user.name,
            resetUrl,
        });

        console.log(`✅ Password reset email sent to ${user.email}`);

        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.',
        });
    } catch (err) {
        console.error('❌ Forgot password error:', err.message);

        // If email fails, clear the token
        const user = await User.findOne({ email: req.body.email?.toLowerCase() });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(500).json({
            success: false,
            error: 'Email could not be sent. Please try again later.',
        });
    }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters.',
            });
        }

        // Hash the incoming token to match the stored hash
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
            isActive: true,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token. Please request a new link.',
            });
        }

        // Set new password and clear reset fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        console.log(`✅ Password reset successful for ${user.email}`);

        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.',
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { login, getMe, register, forgotPassword, resetPassword };
