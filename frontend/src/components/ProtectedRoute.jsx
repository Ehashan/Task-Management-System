import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Protect routes from unauthenticated users
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Protect routes from non-admin users
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Redirect authenticated users away from login/register
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
};
