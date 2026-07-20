const Task = require('../models/Task');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const validSortFields = ['createdAt', 'dueDate', 'priority', 'status', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    // Calculate statistics for dashboard
    const allUserTasks = await Task.find({ user: req.user._id });
    const stats = {
      total: allUserTasks.length,
      pending: allUserTasks.filter((t) => t.status === 'pending').length,
      inProgress: allUserTasks.filter((t) => t.status === 'in-progress').length,
      completed: allUserTasks.filter((t) => t.status === 'completed').length,
      overdue: allUserTasks.filter(
        (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
      ).length,
    };

    res.json({ success: true, count: tasks.length, stats, tasks });
  } catch (error) {
    console.error('GetTasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title, description, and due date are required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate,
    });

    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    console.error('CreateTask error:', error);
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied' });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    res.json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    console.error('UpdateTask error:', error);
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DeleteTask error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied' });
    }

    task.status = status;
    await task.save();

    res.json({ success: true, message: 'Task status updated', task });
  } catch (error) {
    console.error('UpdateStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, updateTaskStatus };
