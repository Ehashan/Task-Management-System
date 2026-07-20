import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, ListTodo, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { adminService } from '../../services';
import { ProgressBar, StatCard, StatusBadge, PriorityBadge } from '../../components/ui';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await adminService.getUserById(id);
        setData(res.data);
      } catch {
        toast.error('Failed to load user details');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { user, tasks, stats } = data;

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: <ListTodo size={20} />, colorClass: 'text-primary-600', bgClass: 'bg-primary-50 dark:bg-primary-900/20' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle size={20} />, colorClass: 'text-green-600', bgClass: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Pending', value: stats.pending, icon: <Clock size={20} />, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { title: 'Overdue', value: stats.overdue, icon: <AlertCircle size={20} />, colorClass: 'text-red-600', bgClass: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/admin/users')} className="btn-ghost btn-sm gap-2">
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-gray-500 dark:text-dark-muted text-sm">
              <Mail size={14} /> {user.email}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-gray-400 text-xs">
              <Calendar size={12} />
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="mt-3">
              <span className={`badge ${user.isActive ? 'badge-completed' : 'badge-pending'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="sm:ml-auto text-center">
            <div className="text-3xl font-bold text-gradient">{stats.progress}%</div>
            <p className="text-xs text-gray-500 dark:text-dark-muted mb-3">Overall Progress</p>
            <div className="w-40"><ProgressBar value={stats.progress} showLabel={false} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="text-center py-12 text-gray-400 dark:text-dark-muted text-sm">No tasks for this user</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border">
                  <th className="text-left pb-3 pr-4 font-semibold text-gray-500 dark:text-dark-muted text-xs uppercase">Title</th>
                  <th className="text-left pb-3 pr-4 font-semibold text-gray-500 dark:text-dark-muted text-xs uppercase">Priority</th>
                  <th className="text-left pb-3 pr-4 font-semibold text-gray-500 dark:text-dark-muted text-xs uppercase">Status</th>
                  <th className="text-left pb-3 font-semibold text-gray-500 dark:text-dark-muted text-xs uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {tasks.map((task) => {
                  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
                  return (
                    <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-800 dark:text-white">{task.title}</p>
                        <p className="text-xs text-gray-400 dark:text-dark-muted line-clamp-1">{task.description}</p>
                      </td>
                      <td className="py-3 pr-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="py-3 pr-4"><StatusBadge status={task.status} /></td>
                      <td className="py-3">
                        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-dark-muted'}`}>
                          {isOverdue ? '⚠ ' : ''}
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
