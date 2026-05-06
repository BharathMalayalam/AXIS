const Module = require('../models/Module');
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const { getDownloadUrl } = require('../utils/s3Config');

// @desc    Create module (TL assigns to dev)
// @route   POST /api/modules
// @access  TL
const createModule = async (req, res) => {
    try {
        const { name, description, projectId, assignedDev, deadline } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });

        const module = await Module.create({ name, description, projectId, assignedDev, deadline });

        // Set project in_progress if a new module is added and it wasn't already
        if (['pending', 'completed', 'approved'].includes(project.status)) {
            project.status = 'in_progress';
            await project.save();
        }

        const populated = await module.populate([
            { path: 'assignedDev', select: 'name userId email' },
            { path: 'projectId', select: 'name' }
        ]);

        res.status(201).json({ success: true, module: populated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all modules (filtered by role)
// @route   GET /api/modules
// @access  All
const getModules = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'developer') filter = { assignedDev: req.user._id };
        else if (req.user.role === 'teamleader') {
            const tlProjects = await Project.find({ assignedTL: req.user._id }).distinct('_id');
            filter = { projectId: { $in: tlProjects } };
        }

        const modulesRaw = await Module.find(filter)
            .populate('assignedDev', 'name userId email')
            .populate('projectId', 'name deadline')
            .sort('-createdAt');

        // Generate signed URLs for all modules with files
        const modules = await Promise.all(modulesRaw.map(async (m) => {
            const moduleObj = m.toObject();
            if (moduleObj.fileKey) {
                moduleObj.fileUrl = await getDownloadUrl(moduleObj.fileKey);
            }
            return moduleObj;
        }));

        res.json({ success: true, count: modules.length, modules });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get modules for a specific project
// @route   GET /api/modules/project/:projectId
// @access  Admin, TL
const getModulesByProject = async (req, res) => {
    try {
        const modulesRaw = await Module.find({ projectId: req.params.projectId })
            .populate('assignedDev', 'name userId');
        
        const modules = await Promise.all(modulesRaw.map(async (m) => {
            const moduleObj = m.toObject();
            if (moduleObj.fileKey) {
                moduleObj.fileUrl = await getDownloadUrl(moduleObj.fileKey);
            }
            return moduleObj;
        }));

        res.json({ success: true, modules });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update module status/fields
// @route   PUT /api/modules/:id
// @access  TL / Dev
const updateModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignedDev', 'name userId')
            .populate('projectId', 'name');
        if (!module) return res.status(404).json({ success: false, error: 'Module not found.' });

        const moduleObj = module.toObject();
        if (moduleObj.fileKey) {
            moduleObj.fileUrl = await getDownloadUrl(moduleObj.fileKey);
        }

        res.json({ success: true, module: moduleObj });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Developer submits module
// @route   PATCH /api/modules/:id/submit
// @access  Developer
const submitModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, error: 'Module not found.' });
        if (module.assignedDev.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized.' });
        }

        module.status = 'submitted';
        module.submittedAt = new Date();
        
        if (req.file) {
            module.fileUrl = req.file.location;
            module.fileKey = req.file.key;
            module.fileName = req.file.originalname;
        }

        await module.save();

        const moduleObj = module.toObject();
        if (moduleObj.fileKey) {
            moduleObj.fileUrl = await getDownloadUrl(moduleObj.fileKey);
        }

        res.json({ success: true, module: moduleObj });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    TL approves module
// @route   PATCH /api/modules/:id/approve
// @access  TL
const approveModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, error: 'Module not found.' });

        module.status = 'completed';
        module.completedAt = new Date();
        await module.save();

        // Resolve any open issues for this module
        await Issue.updateMany({ moduleId: module._id, status: 'open' }, { status: 'resolved', resolvedAt: new Date() });

        // Check if all project modules are completed
        const allMods = await Module.find({ projectId: module.projectId });
        if (allMods.every(m => m.status === 'completed' || m._id.toString() === module._id.toString())) {
            await Project.findByIdAndUpdate(module.projectId, { status: 'completed' });
        }

        res.json({ success: true, module });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    TL rejects module & creates issue
// @route   PATCH /api/modules/:id/reject
// @access  TL
const rejectModule = async (req, res) => {
    try {
        const { description } = req.body;
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, error: 'Module not found.' });

        module.status = 'rejected';
        await module.save();

        // Auto-create an issue
        const issue = await Issue.create({
            moduleId: module._id,
            projectId: module.projectId,
            raisedBy: req.user._id,
            assignedTo: module.assignedDev,
            description: description || 'Work rejected. Please review and resubmit.',
        });

        res.json({ success: true, module, issue });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    TL Dashboard stats
// @route   GET /api/dashboard/tl
// @access  TL
const getTLDashboard = async (req, res) => {
    try {
        const tlProjects = await Project.find({ assignedTL: req.user._id });
        const projectIds = tlProjects.map(p => p._id);
        const allModules = await Module.find({ projectId: { $in: projectIds } });

        res.json({
            success: true,
            stats: {
                totalProjects: tlProjects.length,
                activeProjects: tlProjects.filter(p => p.status === 'in_progress').length,
                totalModules: allModules.length,
                pendingReview: allModules.filter(m => m.status === 'submitted').length,
                completedModules: allModules.filter(m => m.status === 'completed').length,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Developer Dashboard stats
// @route   GET /api/dashboard/dev
// @access  Developer
const getDevDashboard = async (req, res) => {
    try {
        const devModules = await Module.find({ assignedDev: req.user._id });
        res.json({
            success: true,
            stats: {
                totalModules: devModules.length,
                pendingModules: devModules.filter(m => ['assigned','rejected'].includes(m.status)).length,
                submittedModules: devModules.filter(m => m.status === 'submitted').length,
                completedModules: devModules.filter(m => m.status === 'completed').length,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createModule, getModules, getModulesByProject, updateModule, submitModule, approveModule, rejectModule, getTLDashboard, getDevDashboard };
