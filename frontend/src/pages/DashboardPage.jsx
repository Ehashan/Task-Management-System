import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, Clock, AlertCircle, TrendingUp, Plus, ListTodo, Calendar,
} from 'lucide-react';
import { taskService } from '../services';
import { useAuth } from '../context/AuthContext';
import { StatCard, ProgressBar, EmptyState } from '../components/ui';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await taskService.getTasks({ search, ...filters });
      setTasks(data.tasks);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task) => { setEditTask(task); setShowForm(true); };
  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));
  const handleStatusChange = async (id, status) => {
    await taskService.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
    fetchTasks(); // refresh stats
  };

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: <ListTodo size={22} />, colorClass: 'text-primary-600', bgClass: 'bg-primary-50 dark:bg-primary-900/20' },
    { title: 'Pending', value: stats.pending, icon: <Clock size={22} />, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { title: 'In Progress', value: stats.inProgress, icon: <TrendingUp size={22} />, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle size={22} />, colorClass: 'text-green-600', bgClass: 'bg-green-50 dark:bg-green-900/20' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-violet-700 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Good day, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-primary-100 text-sm mt-1">
              You have {stats.pending + stats.inProgress} active task{stats.pending + stats.inProgress !== 1 ? 's' : ''} to work on
            </p>
            <div className="mt-4 space-y-1 max-w-xs">
              <div className="flex justify-between text-xs text-primary-200">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          {stats.overdue > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-2xl p-4">
              <AlertCircle size={20} className="text-red-300" />
              <div>
                <p className="text-white font-bold text-lg">{stats.overdue}</p>
                <p className="text-red-200 text-xs">Overdue</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Task list */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
          <button
            onClick={() => { setEditTask(null); setShowForm(true); }}
            className="btn-primary btn-sm"
            id="add-task-btn"
          >
            <Plus size={14} /> New Task
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
            id="task-search"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="input w-full sm:w-36"
            id="status-filter"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
            className="input w-full sm:w-36"
            id="priority-filter"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={<ListTodo size={36} />}
            title="No tasks found"
            description={search || filters.status || filters.priority ? "Try adjusting your filters" : "Get started by creating your first task"}
            action={
              !search && !filters.status && !filters.priority && (
                <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
                  <Plus size={14} /> Create Task
                </button>
              )
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        onSuccess={fetchTasks}
        editTask={editTask}
      />
    </div>
  );
};

export default DashboardPage;
