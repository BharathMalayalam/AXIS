const Issue = require('../models/Issue');

// @desc    Create issue for a module
// @route   POST /api/issues
// @access  TL
const createIssue = async (req, res) => {
    try {
        const { moduleId, projectId, assignedTo, description } = req.body;
        const issue = await Issue.create({ moduleId, projectId, raisedBy: req.user._id, assignedTo, description });
        const populated = await issue.populate([
            { path: 'raisedBy', select: 'name userId' },
            { path: 'assignedTo', select: 'name userId' },
            { path: 'moduleId', select: 'name' }
        ]);
        res.status(201).json({ success: true, issue: populated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get issues for a module
// @route   GET /api/issues/:moduleId
// @access  TL / Dev
const getIssuesByModule = async (req, res) => {
    try {
        const issues = await Issue.find({ moduleId: req.params.moduleId })
            .populate('raisedBy', 'name userId')
            .populate('assignedTo', 'name userId')
            .sort('-createdAt');
        res.json({ success: true, issues });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all issues for the current developer
// @route   GET /api/issues/my-issues
// @access  Developer
const getMyIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ assignedTo: req.user._id })
            .populate('moduleId', 'name')
            .populate('projectId', 'name')
            .populate('raisedBy', 'name userId')
            .sort('-createdAt');
        res.json({ success: true, issues });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Mark issue as resolved
// @route   PATCH /api/issues/:id/resolve
// @access  Dev / TL
const resolveIssue = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status: 'resolved', resolvedAt: new Date() },
            { new: true }
        );
        if (!issue) return res.status(404).json({ success: false, error: 'Issue not found.' });
        res.json({ success: true, issue });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createIssue, getIssuesByModule, getMyIssues, resolveIssue };
