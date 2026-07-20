const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getAllTasks,
  adminUpdateTask,
  adminDeleteTask,
  deleteUser,
  toggleUserStatus,
  getAdminStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', toggleUserStatus);

router.get('/tasks', getAllTasks);
router.put('/tasks/:id', adminUpdateTask);
router.delete('/tasks/:id', adminDeleteTask);

module.exports = router;
