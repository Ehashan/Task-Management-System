import { useState } from 'react';
import { Calendar, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './ui';
import ConfirmModal from './ConfirmModal';
import { taskService } from '../services';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'in-progress', 'completed'];

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdmin = false }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOverdue =
    task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();

  const handleDelete = async () => {
    try {
      if (isAdmin) {
        await onDelete(task._id);
      } else {
        await taskService.deleteTask(task._id);
        onDelete(task._id);
        toast.success('Task deleted');
      }
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setShowStatusMenu(false);
    try {
      await onStatusChange(task._id, newStatus);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No date';

  return (
    <div className={`card-hover p-5 animate-slide-up ${loading ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost btn-sm p-1.5 rounded-lg"
            aria-label="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-ghost btn-sm p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-dark-muted line-clamp-2 mb-4">
        {task.description}
      </p>

      {/* Admin user tag */}
      {isAdmin && task.user && (
        <div className="mb-3 text-xs text-primary-600 dark:text-primary-400 font-medium">
          👤 {task.user.name || task.user.email}
        </div>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        {isOverdue && (
          <span className="badge bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            ⚠ Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-dark-muted'}`}>
          <Calendar size={12} />
          {formattedDate}
        </div>

        {/* Status changer */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Change Status <ChevronDown size={12} />
          </button>

          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute right-0 bottom-full mb-1 card shadow-lg z-20 py-1 min-w-[140px] animate-scale-in">
                {STATUS_OPTIONS.filter((s) => s !== task.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-dark-hover capitalize transition-colors"
                  >
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
      />
    </div>
  );
};

export default TaskCard;
