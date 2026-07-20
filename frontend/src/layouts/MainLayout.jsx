import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Map routes to page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/tasks/new': 'Add Task',
  '/profile': 'My Profile',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/tasks': 'All Tasks',
  '/admin/analytics': 'Analytics',
  '/admin/profile': 'Admin Profile',
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const exactMatch = pageTitles[location.pathname];
    if (exactMatch) return exactMatch;
    // Match pattern routes like /admin/users/:id
    if (location.pathname.startsWith('/admin/users/')) return 'User Details';
    if (location.pathname.startsWith('/tasks/edit/')) return 'Edit Task';
    return 'TaskFlow';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} title={getTitle()} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
