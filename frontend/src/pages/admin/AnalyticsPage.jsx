import { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle, Clock, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { adminService } from '../../services';
import { ProgressBar } from '../../components/ui';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
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
        setUsers(usersRes.data.users);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const total = stats.totalTasks || 1;
  const completionRate = Math.round((stats.completed / total) * 100);
  const pendingRate = Math.round((stats.pending / total) * 100);
  const progressRate = Math.round((stats.inProgress / total) * 100);
  const overdueRate = Math.round((stats.overdue / total) * 100);

  const distribution = [
    { label: 'Completed', value: stats.completed, pct: completionRate, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
    { label: 'In Progress', value: stats.inProgress, pct: progressRate, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Pending', value: stats.pending, pct: pendingRate, color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Overdue', value: stats.overdue, pct: overdueRate, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 size={20} className="text-primary-600" /> Analytics
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">System-wide performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: <Users size={20} />, bg: 'bg-violet-50 dark:bg-violet-900/20', color: 'text-violet-600' },
          { label: 'Total Tasks', value: stats.totalTasks, icon: <BarChart3 size={20} />, bg: 'bg-primary-50 dark:bg-primary-900/20', color: 'text-primary-600' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: <TrendingUp size={20} />, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-600' },
          { label: 'Overdue Tasks', value: stats.overdue, icon: <AlertCircle size={20} />, bg: 'bg-red-50 dark:bg-red-900/20', color: 'text-red-600' },
        ].map((k) => (
          <div key={k.label} className="stat-card">
            <div className={`stat-icon ${k.bg}`}>
              <span className={k.color}>{k.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</p>
              <p className="text-sm text-gray-500 dark:text-dark-muted">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Task distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <PieChart size={16} className="text-primary-600" /> Task Distribution
          </h3>
          <div className="space-y-4">
            {distribution.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${d.textColor}`}>{d.value}</span>
                    <span className="text-xs text-gray-400">({d.pct}%)</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-dark-border overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User leaderboard */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Users size={16} className="text-primary-600" /> User Leaderboard
          </h3>
          {users.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
          ) : (
            <div className="space-y-4">
              {[...users]
                .sort((a, b) => b.stats.progress - a.stats.progress)
                .slice(0, 7)
                .map((user, idx) => (
                  <div key={user._id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-100 text-gray-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500 dark:bg-dark-hover dark:text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">{user.stats.progress}%</span>
                      </div>
                      <ProgressBar value={user.stats.progress} showLabel={false} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
