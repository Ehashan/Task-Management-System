import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-8 w-32 h-32 bg-violet-500/30 rounded-2xl rotate-12" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <CheckSquare size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white items-center justify-center">Task Management System</h1>
              
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Manage your tasks<br />
            <span className="text-primary-200">like a pro</span>
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Organize Tasks', desc: 'Create, track and manage all your tasks in one place' },
              { title: 'Priority Management', desc: 'Set priorities and never miss a deadline again' },
              { title: 'Progress Tracking', desc: 'Monitor your productivity with visual dashboards' },
            ].map((f) => (
              <div key={f.title} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-primary-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-200 text-xs">
          © 2026 TaskFlow. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Theme toggle */}
        <div className="flex justify-end p-6">
          <button onClick={toggleTheme} className="btn-ghost p-2.5 rounded-xl">
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-12">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                  <CheckSquare size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg text-gradient">TaskFlow</span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
              <p className="text-gray-500 dark:text-dark-muted mt-2 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg"
                id="login-submit-btn"
              >
                {loading ? 'Signing in...' : (
                  <><span>Sign In</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>
  

            <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
