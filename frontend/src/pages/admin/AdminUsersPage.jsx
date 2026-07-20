import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminService } from '../../services';
import { ProgressBar } from '../../components/ui';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, action: null, msg: '' });
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await adminService.getAllUsers();
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await adminService.toggleUserStatus(userId);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={20} className="text-primary-600" /> User Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
          id="users-search"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-hover">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">User</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Total</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Pending</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Done</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide w-40">Progress</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-dark-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-400 dark:text-dark-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-700 dark:text-gray-300">{user.stats.total}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="badge badge-pending">{user.stats.pending}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="badge badge-completed">{user.stats.completed}</span>
                    </td>
                    <td className="px-4 py-4 w-40">
                      <ProgressBar value={user.stats.progress} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setConfirmModal({
                          open: true,
                          userId: user._id,
                          action: 'toggle',
                          msg: `${user.isActive ? 'Deactivate' : 'Activate'} user "${user.name}"?`,
                        })}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          user.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.isActive ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="btn-ghost btn-sm p-1.5 rounded-lg text-primary-600"
                          aria-label="View user"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmModal({
                            open: true,
                            userId: user._id,
                            action: 'delete',
                            msg: `Delete "${user.name}" and all their tasks? This cannot be undone.`,
                          })}
                          className="btn-ghost btn-sm p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, userId: null, action: null, msg: '' })}
        onConfirm={() => {
          if (confirmModal.action === 'delete') handleDelete(confirmModal.userId);
          else handleToggleStatus(confirmModal.userId);
        }}
        title={confirmModal.action === 'delete' ? 'Delete User' : 'Change User Status'}
        message={confirmModal.msg}
        confirmText={confirmModal.action === 'delete' ? 'Delete' : 'Confirm'}
        type={confirmModal.action === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default AdminUsersPage;
