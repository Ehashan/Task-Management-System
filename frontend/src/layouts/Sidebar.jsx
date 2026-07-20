import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, Plus, User, LogOut, Users,
  BarChart3, CheckSquare, ChevronLeft, Menu, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import { useState } from 'react';

const userLinks = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/tasks', icon: <ListTodo size={18} />, label: 'My Tasks' },
  { to: '/tasks/new', icon: <Plus size={18} />, label: 'Add Task' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/admin/tasks', icon: <CheckSquare size={18} />, label: 'All Tasks' },
  { to: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
  { to: '/admin/profile', icon: <User size={18} />, label: 'Profile' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full z-30 flex flex-col bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-100 dark:border-dark-border">
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                <CheckSquare size={16} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-sm text-gradient">Task Management </span>
                {isAdmin && (
                  <div className="flex items-center gap-1 text-xs text-primary-500">
                    <ShieldCheck size={10} /> Admin
                  </div>
                )}
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <CheckSquare size={16} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-ghost p-1.5 rounded-lg ml-auto"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-dark-muted truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? link.label : undefined}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!collapsed && <span className="animate-fade-in">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-dark-border">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Logout"
        type="warning"
      />
    </>
  );
};

export default Sidebar;
