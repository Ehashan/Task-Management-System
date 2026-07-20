import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ collapsed, setCollapsed, title }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border sticky top-0 z-20 glass">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-4">
        <button
          className="btn-ghost p-2 rounded-xl lg:hidden"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-xs text-gray-400 dark:text-dark-muted">
            {isAdmin ? 'Super Admin Panel' : 'Task Management'}
          </p>
        </div>
      </div>

      {/* Right: theme + avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2.5 rounded-xl"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
