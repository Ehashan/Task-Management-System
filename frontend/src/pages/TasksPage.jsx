import { useState, useEffect, useCallback } from 'react';
import { Plus, ListTodo, Search, SlidersHorizontal } from 'lucide-react';
import { taskService } from '../services';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'dueDate:asc', label: 'Due Date (Earliest)' },
  { value: 'dueDate:desc', label: 'Due Date (Latest)' },
  { value: 'priority:desc', label: 'High Priority First' },
];

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sort, setSort] = useState('createdAt:desc');
  const [showFilters, setShowFilters] = useState(false);

  const [sortBy, order] = sort.split(':');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await taskService.getTasks({ search, ...filters, sortBy, order });
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filters, sortBy, order]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleEdit = (task) => { setEditTask(task); setShowForm(true); };
  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));
  const handleStatusChange = async (id, status) => {
    await taskService.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ status: '', priority: '' });
    setSort('createdAt:desc');
  };

  const hasFilters = search || filters.status || filters.priority || sort !== 'createdAt:desc';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary btn-sm ${hasFilters ? 'border-primary-500 text-primary-600' : ''}`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
          </button>
          <button
            onClick={() => { setEditTask(null); setShowForm(true); }}
            className="btn-primary btn-sm"
            id="create-task-btn"
          >
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
          id="tasks-search-bar"
        />
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="input"
                id="filter-status"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
                className="input"
                id="filter-priority"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input"
                id="filter-sort"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost btn-sm mt-3 text-red-500 hover:text-red-600">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Task grid */}
      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo size={36} />}
          title="No tasks found"
          description={hasFilters ? "Try adjusting your search or filters" : "You haven't created any tasks yet"}
          action={
            !hasFilters && (
              <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
                <Plus size={14} /> Create Your First Task
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

      <TaskForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        onSuccess={fetchTasks}
        editTask={editTask}
      />
    </div>
  );
};

export default TasksPage;
