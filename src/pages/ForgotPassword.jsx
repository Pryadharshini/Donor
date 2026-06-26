import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: '', mobile: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.mobile || !form.newPassword || !form.confirmPassword) {
      return setError('All fields are required.');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/donors/reset-password`, {
        email: form.email,
        mobile: form.mobile,
        newPassword: form.newPassword
      });
      setSuccess(true);
      addToast('Password reset successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Password Reset Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your password has been successfully updated. You can now use your new password to sign in.
          </p>
          <Link to="/login" className="btn-primary inline-flex">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <FaHeartbeat size={28} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Verify your identity using your registered email and mobile number to securely change your password.
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="label">Registered Email</label>
              <div className="relative">
                <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com" className="input-field pl-11" required />
              </div>
            </div>

            {/* Mobile Field */}
            <div>
              <label className="label">Registered Mobile Number</label>
              <div className="relative">
                <FiPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                  placeholder="e.g., 9876543210" className="input-field pl-11" required />
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPwd ? 'text' : 'password'} value={form.newPassword} onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Enter new password" className="input-field pl-11 pr-11" required minLength="6" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfPwd ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password" className="input-field pl-11 pr-11" required minLength="6" />
                <button type="button" onClick={() => setShowConfPwd(!showConfPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-70">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</> : <>Reset Password <FiArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
