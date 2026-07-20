import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-6">
    <div className="text-center animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/30 dark:to-violet-900/30 flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={40} className="text-primary-600 dark:text-primary-400" />
      </div>
      <h1 className="text-8xl font-black text-gradient mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Page Not Found</h2>
      <p className="text-gray-500 dark:text-dark-muted mb-8 max-w-xs mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary btn-lg inline-flex">
        <Home size={18} /> Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
