import { useState, useEffect } from 'react';
import {
  Users, CheckSquare, Clock, TrendingUp, AlertCircle, Activity,
  CheckCircle, BarChart3,
} from 'lucide-react';
import { adminService } from '../../services';
import { StatCard, ProgressBar } from '../../components/ui';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getAllUsers(),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users.slice(0, 5)); // Top 5
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: <Users size={22} />,
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-50 dark:bg-violet-900/20',
      subtitle: 'Registered accounts',
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks ?? 0,
      icon: <CheckSquare size={22} />,
      colorClass: 'text-primary-600',
      bgClass: 'bg-primary-50 dark:bg-primary-900/20',
      subtitle: 'All user tasks',
    },
    {
      title: 'Pending',
      value: stats?.pending ?? 0,
      icon: <Clock size={22} />,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
      subtitle: 'Awaiting action',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress ?? 0,
      icon: <TrendingUp size={22} />,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      subtitle: 'Currently active',
    },
    {
      title: 'Completed',
      value: stats?.completed ?? 0,
      icon: <CheckCircle size={22} />,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50 dark:bg-green-900/20',
      subtitle: 'Successfully done',
    },
    {
      title: 'Overdue',
      value: stats?.overdue ?? 0,
      icon: <AlertCircle size={22} />,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      subtitle: 'Past due date',
    },
  ];

  const completionRate = stats?.totalTasks > 0
    ? Math.round((stats.completed / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header banner */}
      <div className="card p-6 bg-gradient-to-r from-violet-600 to-primary-700 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Admin Overview </h2>
            <p className="text-primary-100 text-sm mt-1">
              System-wide statistics and user management
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur">
            <Activity size={20} className="text-white" />
            <div>
              <p className="text-white font-bold text-lg">{completionRate}%</p>
              <p className="text-primary-200 text-xs">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* Mini progress */}
        <div className="mt-4 max-w-sm">
          <div className="flex justify-between text-xs text-primary-200 mb-1">
            <span>System Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Top users table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">Top Users by Progress</h3>
          </div>
          <a href="/admin/users" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
            View all →
          </a>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-dark-muted text-center py-8">No users registered yet</p>
        ) : (
          <div className="space-y-4">
            {users
              .sort((a, b) => b.stats.progress - a.stats.progress)
              .map((user, idx) => (
                <div key={user._id} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                      <span className="text-xs text-gray-500 dark:text-dark-muted ml-2 flex-shrink-0">
                        {user.stats.completed}/{user.stats.total} tasks
                      </span>
                    </div>
                    <ProgressBar value={user.stats.progress} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
