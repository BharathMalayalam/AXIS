const express = require('express');
const { 
    getUsers, 
    getUserById, 
    createTeamLeader, 
    createDeveloper, 
    deleteUser, 
    getMyTeam 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.post('/create-tl', authorize('admin'), createTeamLeader);
router.post('/create-dev', authorize('admin'), createDeveloper);
router.get('/my-team', authorize('teamleader'), getMyTeam);
router.get('/:id', authorize('admin'), getUserById);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
