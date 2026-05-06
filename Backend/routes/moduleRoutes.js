const express = require('express');
const { 
    createModule, 
    getModules, 
    getModulesByProject, 
    updateModule, 
    submitModule, 
    approveModule, 
    rejectModule,
    getTLDashboard,
    getDevDashboard
} = require('../controllers/moduleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('teamleader'), createModule);
router.get('/', getModules);
router.get('/project/:projectId', getModulesByProject);
router.get('/dashboard/tl', authorize('teamleader'), getTLDashboard);
router.get('/dashboard/dev', authorize('developer'), getDevDashboard);
router.put('/:id', authorize('teamleader', 'developer'), updateModule);
const { upload } = require('../utils/s3Config');


router.patch('/:id/submit', authorize('developer'), upload.single('file'), submitModule);
router.patch('/:id/approve', authorize('teamleader'), approveModule);
router.patch('/:id/reject', authorize('teamleader'), rejectModule);

module.exports = router;
