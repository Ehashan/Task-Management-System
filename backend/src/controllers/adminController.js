const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all users with task stats
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });

    // Aggregate task stats per user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ user: user._id });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const pending = tasks.filter((t) => t.status === 'pending').length;
        const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
        const overdue = tasks.filter(
          (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
        ).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          ...user.toObject(),
          stats: { total, completed, pending, inProgress, overdue, progress },
        };
      })
    );

    res.json({ success: true, count: usersWithStats.length, users: usersWithStats });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single user with tasks
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      user,
      tasks,
      stats: { total, completed, pending, inProgress, overdue, progress },
    });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all tasks (admin view)
// @route   GET /api/admin/tasks
// @access  Admin
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, search, userId, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (userId) filter.user = userId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const tasks = await Task.find(filter)
      .populate('user', 'name email')
      .sort({ [sortBy]: sortOrder });

    // Global stats
    const allTasks = await Task.find({});
    const stats = {
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      overdue: allTasks.filter(
        (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
      ).length,
    };

    res.json({ success: true, count: tasks.length, stats, tasks });
  } catch (error) {
    console.error('GetAllTasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update any task (admin)
// @route   PUT /api/admin/tasks/:id
// @access  Admin
const adminUpdateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, status, dueDate } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    res.json({ success: true, message: 'Task updated', task });
  } catch (error) {
    console.error('AdminUpdateTask error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete any task (admin)
// @route   DELETE /api/admin/tasks/:id
// @access  Admin
const adminDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('AdminDeleteTask error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete an admin' });
    }

    await Task.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and their tasks deleted successfully' });
  } catch (error) {
    console.error('DeleteUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify admin status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    console.error('ToggleUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const allTasks = await Task.find({});
    const now = new Date();

    const stats = {
      totalUsers,
      totalTasks: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      overdue: allTasks.filter((t) => t.status !== 'completed' && new Date(t.dueDate) < now).length,
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('GetAdminStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllTasks,
  adminUpdateTask,
  adminDeleteTask,
  deleteUser,
  toggleUserStatus,
  getAdminStats,
};
