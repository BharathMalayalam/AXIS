const Query = require('../models/Query');

// @desc    Create a query (Dev → TL)
// @route   POST /api/queries
// @access  Developer
const createQuery = async (req, res) => {
    try {
        const { subject, message, toId, moduleId } = req.body;
        const query = await Query.create({ subject, message, fromId: req.user._id, toId, moduleId: moduleId || null });
        const populated = await query.populate([
            { path: 'fromId', select: 'name userId' },
            { path: 'toId', select: 'name userId' }
        ]);
        res.status(201).json({ success: true, query: populated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get queries (filtered by role)
// @route   GET /api/queries
// @access  TL / Dev
const getQueries = async (req, res) => {
    try {
        const filter = req.user.role === 'developer'
            ? { fromId: req.user._id }
            : { toId: req.user._id };

        const queries = await Query.find(filter)
            .populate('fromId', 'name userId')
            .populate('toId', 'name userId')
            .populate('moduleId', 'name')
            .sort('-createdAt');

        res.json({ success: true, count: queries.length, queries });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get queries for a specific module
// @route   GET /api/queries/module/:moduleId
// @access  TL / Dev
const getQueriesByModule = async (req, res) => {
    try {
        const queries = await Query.find({ moduleId: req.params.moduleId })
            .populate('fromId', 'name userId')
            .populate('toId', 'name userId')
            .sort('-createdAt');
        res.json({ success: true, queries });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    TL replies to a query
// @route   PATCH /api/queries/:id/reply
// @access  TL
const replyQuery = async (req, res) => {
    try {
        const { reply } = req.body;
        if (!reply) return res.status(400).json({ success: false, error: 'Reply content is required.' });

        const query = await Query.findById(req.params.id);
        if (!query) return res.status(404).json({ success: false, error: 'Query not found.' });

        query.reply = reply;
        query.repliedAt = new Date();
        await query.save();

        res.json({ success: true, query });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createQuery, getQueries, getQueriesByModule, replyQuery };
