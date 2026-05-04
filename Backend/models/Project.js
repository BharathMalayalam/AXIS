const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Project name is required'], trim: true },
    description: { type: String, default: '' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTL: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deadline: { type: Date, required: [true, 'Deadline is required'] },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: { type: String, default: null },
    approvedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
