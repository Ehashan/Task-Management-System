import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';

// Public pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// User pages
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* User routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/new" element={<TasksPage openForm />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/tasks" element={<AdminTasksPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
