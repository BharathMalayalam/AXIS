const express = require('express');
const { 
    createIssue, 
    getIssuesByModule, 
    getMyIssues, 
    resolveIssue 
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('teamleader'), createIssue);
router.get('/my-issues', authorize('developer'), getMyIssues);
router.get('/:moduleId', getIssuesByModule);
router.patch('/:id/resolve', resolveIssue);

module.exports = router;
