const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hide password in responses
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
