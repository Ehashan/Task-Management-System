import { useState } from 'react';
import { User, Mail, Shield, Calendar, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [showPassForm, setShowPassForm] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassForm((f) => ({ ...f, [name]: value }));
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (passForm.newPass.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passForm.newPass !== passForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    // In a real app, you'd call an API here
    toast.success('Password change feature coming soon!');
    setShowPassForm(false);
    setPassForm({ current: '', newPass: '', confirm: '' });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center text-white font-bold text-3xl shadow-glow mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-dark-muted text-sm mt-1">{user?.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`badge ${user?.role === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
              <Shield size={10} />
              {user?.role === 'admin' ? 'Super Admin' : 'User'}
            </span>
            <span className={`badge ${user?.isActive ? 'badge-completed' : 'badge-pending'}`}>
              {user?.isActive ? <><CheckCircle size={10} /> Active</> : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Info fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-hover">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <User size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-muted">Full Name</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-muted">Email Address</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-hover">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Calendar size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-muted">Member Since</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Lock size={18} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Password & Security</h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">Update your password</p>
            </div>
          </div>
          <button
            onClick={() => setShowPassForm(!showPassForm)}
            className="btn-secondary btn-sm"
          >
            {showPassForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPassForm && (
          <form onSubmit={handlePassSubmit} className="space-y-4 animate-slide-up pt-4 border-t border-gray-100 dark:border-dark-border">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="current"
                  value={passForm.current}
                  onChange={handlePassChange}
                  className="input pl-10"
                  placeholder="Enter current password"
                />
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="newPass"
                  value={passForm.newPass}
                  onChange={handlePassChange}
                  className="input pl-10 pr-10"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  value={passForm.confirm}
                  onChange={handlePassChange}
                  className="input pl-10"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
