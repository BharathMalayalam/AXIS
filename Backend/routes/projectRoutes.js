const express = require('express');
const { 
    createProject, 
    getProjects, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    approveProject, 
    rejectProject,
    getAdminDashboard
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('admin'), createProject);
router.get('/', getProjects);
router.get('/dashboard/admin', authorize('admin'), getAdminDashboard);
router.get('/:id', getProjectById);
router.patch('/:id', authorize('admin', 'teamleader'), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);
router.patch('/:id/approve', authorize('admin'), approveProject);
router.patch('/:id/reject', authorize('admin'), rejectProject);

module.exports = router;
