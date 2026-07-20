import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 16, md: 32, lg: 48 };
  const px = sizes[size] || 32;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg z-50 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 animate-pulse-slow opacity-20 absolute inset-0" />
          <Loader2 size={48} className="text-primary-600 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-muted font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Loader2 size={px} className="text-primary-600 animate-spin" />
      {text && <span className="text-sm text-gray-500 dark:text-dark-muted">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
