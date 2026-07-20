import { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Tag, BarChart2 } from 'lucide-react';
import { taskService, adminService } from '../services';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in-progress', 'completed'];

const TaskForm = ({ isOpen, onClose, onSuccess, editTask = null, isAdmin = false }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        status: editTask.status || 'pending',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
    }
    setErrors({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length < 3) errs.title = 'Title must be at least 3 characters';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.length < 5) errs.description = 'Description must be at least 5 characters';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (editTask) {
        if (isAdmin) {
          await adminService.updateTask(editTask._id, form);
        } else {
          await taskService.updateTask(editTask._id, form);
        }
        toast.success('Task updated successfully!');
      } else {
        await taskService.createTask(form);
        toast.success('Task created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative card w-full max-w-lg animate-scale-in z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-dark-border">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {editTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
              {editTask ? 'Update task details below' : 'Fill in the details to create a new task'}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-xl" aria-label="Close form">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="label">
              <Tag size={13} className="inline mr-1" /> Title
            </label>
            <input
              id="task-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`input ${errors.title ? 'input-error' : ''}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="label">
              <AlignLeft size={13} className="inline mr-1" /> Description
            </label>
            <textarea
              id="task-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter task description"
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="label">
                <BarChart2 size={13} className="inline mr-1" /> Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-status" className="label">Status</label>
              <select
                id="task-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="task-due" className="label">
              <Calendar size={13} className="inline mr-1" /> Due Date
            </label>
            <input
              id="task-due"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={`input ${errors.dueDate ? 'input-error' : ''}`}
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
