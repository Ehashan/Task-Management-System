import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: '50%' };
    if (p.length < 12 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-yellow-400', width: '75%' };
    return { label: 'Strong', color: 'bg-green-400', width: '100%' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-violet-600 via-primary-700 to-primary-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <CheckSquare size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Task Management System</h1>
            
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-6">
            Start your journey<br />
            <span className="text-primary-200">today for free</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['Track Tasks', 'Set Priorities', 'Meet Deadlines', 'View Progress'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-white">
                <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-200 text-xs">© 2026 TaskFlow. All rights reserved.</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-6">
          <button onClick={toggleTheme} className="btn-ghost p-2.5 rounded-xl">
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-8">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                  <CheckSquare size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg text-gradient">TaskFlow</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create account</h2>
              <p className="text-gray-500 dark:text-dark-muted mt-2 text-sm">
                Join TaskFlow and start managing your tasks today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="reg-name" className="label">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="reg-email"
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
                <label htmlFor="reg-password" className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && strength && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full bg-gray-100 dark:bg-dark-border overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password strength: <span className="font-medium">{strength.label}</span></p>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" className="label">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="reg-confirm"
                    type={showPass ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg mt-2"
                id="register-submit-btn"
              >
                {loading ? 'Creating account...' : (
                  <><span>Create Account</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
