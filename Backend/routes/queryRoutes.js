const express = require('express');
const { 
    createQuery, 
    getQueries, 
    getQueriesByModule, 
    replyQuery 
} = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('developer'), createQuery);
router.get('/', getQueries);
router.get('/module/:moduleId', getQueriesByModule);
router.patch('/:id/reply', authorize('teamleader'), replyQuery);

module.exports = router;
