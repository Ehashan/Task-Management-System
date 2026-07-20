import { useState, useEffect, useCallback } from 'react';
import { Search, CheckSquare } from 'lucide-react';
import { adminService } from '../../services';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getAllTasks({ search, ...filters });
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    await adminService.updateTask(id, { status });
    setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare size={20} className="text-primary-600" /> All Tasks
          </h2>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{tasks.length} total tasks across all users</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search all tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
          id="admin-task-search"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="input w-40"
          id="admin-task-status-filter"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="input w-40"
          id="admin-task-priority-filter"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={36} />}
          title="No tasks found"
          description="No tasks match your search criteria"
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => { setEditTask(t); setShowForm(true); }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              isAdmin
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        onSuccess={fetchTasks}
        editTask={editTask}
        isAdmin
      />
    </div>
  );
};

export default AdminTasksPage;
