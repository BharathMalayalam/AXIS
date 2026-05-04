const Project = require('../models/Project');
const Module = require('../models/Module');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Query = require('../models/Query');

// @desc    Create project
// @route   POST /api/projects
// @access  Admin
const createProject = async (req, res) => {
    try {
        const { name, description, assignedTL, deadline } = req.body;

        const tl = await User.findById(assignedTL);
        if (!tl || tl.role !== 'teamleader') {
            return res.status(400).json({ success: false, error: 'Invalid Team Leader.' });
        }

        const project = await Project.create({ name, description, assignedTL, deadline, createdBy: req.user._id });
        const populated = await project.populate([{ path: 'assignedTL', select: 'name userId email' }, { path: 'createdBy', select: 'name userId' }]);

        res.status(201).json({ success: true, project: populated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all projects (filtered by role)
// @route   GET /api/projects
// @access  All authenticated
const getProjects = async (req, res) => {
    try {
        let filter = {};
        let query = {};
        if (req.user.role === 'teamleader') {
            query = { assignedTL: req.user._id };
        } else if (req.user.role === 'developer') {
            // Developers might need to see projects they are part of (via modules)
            // or we can just let them see all projects names for context
            query = {}; 
        }

        const projects = await Project.find(query)
            .populate('assignedTL', 'name userId')
            .sort('-createdAt');
        res.json({ success: true, count: projects.length, projects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single project with progress
// @route   GET /api/projects/:id
// @access  All authenticated
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('assignedTL', 'name userId email phone')
            .populate('createdBy', 'name userId');

        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });

        const modules = await Module.find({ projectId: project._id }).populate('assignedDev', 'name userId');
        const progress = modules.length > 0
            ? Math.round((modules.filter(m => m.status === 'completed').length / modules.length) * 100)
            : 0;

        res.json({ success: true, project, modules, progress });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update project
// @route   PATCH /api/projects/:id
// @access  Admin / TL
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
        
        // Find all modules for this project
        const modules = await Module.find({ projectId: req.params.id });
        const moduleIds = modules.map(m => m._id);
        
        // Cascade delete Issues and Queries related to these modules
        await Query.deleteMany({ moduleId: { $in: moduleIds } });
        await Issue.deleteMany({ projectId: req.params.id });
        await Module.deleteMany({ projectId: req.params.id });
        
        res.json({ success: true, message: 'Project and all related data deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Approve project (Admin final sign-off)
// @route   PATCH /api/projects/:id/approve
// @access  Admin
const approveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
        if (project.status !== 'completed') return res.status(400).json({ success: false, error: 'Project is not yet completed.' });

        project.status = 'approved';
        project.approvedAt = new Date();
        await project.save();
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Reject project
// @route   PATCH /api/projects/:id/reject
// @access  Admin
const rejectProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });

        project.status = 'rejected';
        project.rejectionReason = req.body.reason || 'No reason provided';
        await project.save();
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Admin
const getAdminDashboard = async (req, res) => {
    try {
        const [totalProjects, activeProjects, completedProjects, pendingApproval, totalTLs, totalDevs] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments({ status: 'in_progress' }),
            Project.countDocuments({ status: { $in: ['completed', 'approved'] } }),
            Project.countDocuments({ status: 'completed' }),
            User.countDocuments({ role: 'teamleader' }),
            User.countDocuments({ role: 'developer' }),
        ]);
        res.json({ success: true, stats: { totalProjects, activeProjects, completedProjects, pendingApproval, totalTLs, totalDevs } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, approveProject, rejectProject, getAdminDashboard };
