const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    message: { type: String, required: [true, 'Message is required'] },
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        default: null
    },
    reply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
