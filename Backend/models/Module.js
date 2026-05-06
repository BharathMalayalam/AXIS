const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Module name is required'], trim: true },
    description: { type: String, default: '' },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedDev: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deadline: { type: Date, required: [true, 'Module deadline is required'] },
    status: {
        type: String,
        enum: ['assigned', 'in_progress', 'submitted', 'completed', 'rejected'],
        default: 'assigned'
    },
    submittedAt: { type: Date, default: null },
    fileUrl: { type: String, default: null },
    fileKey: { type: String, default: null },
    fileName: { type: String, default: null },
    completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
