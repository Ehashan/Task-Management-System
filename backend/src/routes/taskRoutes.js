const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
