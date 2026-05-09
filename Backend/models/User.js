const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
    phone: { type: String, required: [true, 'Phone is required'] },
    userId: { type: String, required: [true, 'User ID is required'], unique: true, uppercase: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    role: {
        type: String,
        enum: ['admin', 'teamleader', 'developer'],
        required: true
    },
    teamLeaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isActive: { type: Boolean, default: true },

    // Password reset fields
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password-reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash it and store in DB
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Return the un-hashed token (sent via email)
    return resetToken;
};

// Hide password in responses
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
