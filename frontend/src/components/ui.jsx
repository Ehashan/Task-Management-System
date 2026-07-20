import { CheckCircle, Clock, AlertCircle, CircleDot } from 'lucide-react';

// Priority badge
export const PriorityBadge = ({ priority }) => {
  const map = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
  };
  return (
    <span className={map[priority] || 'badge-low'}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
};

// Status badge
export const StatusBadge = ({ status }) => {
  const config = {
    pending: { cls: 'badge-pending', icon: <Clock size={10} />, label: 'Pending' },
    'in-progress': { cls: 'badge-in-progress', icon: <CircleDot size={10} />, label: 'In Progress' },
    completed: { cls: 'badge-completed', icon: <CheckCircle size={10} />, label: 'Completed' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={c.cls}>
      {c.icon}
      {c.label}
    </span>
  );
};

// Progress bar
export const ProgressBar = ({ value = 0, showLabel = true }) => {
  const getColor = (v) => {
    if (v >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (v >= 50) return 'bg-gradient-to-r from-primary-400 to-violet-500';
    if (v >= 25) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-rose-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="progress-bar flex-1">
        <div
          className={`progress-fill ${getColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted w-9 text-right">
          {value}%
        </span>
      )}
    </div>
  );
};

// Stat card
export const StatCard = ({ title, value, icon, colorClass, bgClass, subtitle }) => (
  <div className="stat-card animate-slide-up">
    <div className={`stat-icon ${bgClass}`}>
      <span className={colorClass}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// Empty state
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-hover flex items-center justify-center mb-4 text-gray-400 dark:text-gray-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-dark-muted max-w-xs mb-4">{description}</p>
    {action}
  </div>
);
