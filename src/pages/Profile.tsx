import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useTaskStore } from '../store';
import { User, LogOut, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function Profile() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useTaskStore((state) => state.user);
  const setUser = useTaskStore((state) => state.setUser);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;

    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent!');
    } catch (err) {
      toast.error('Failed to send verification email');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="cyber-gradient" />
      
      <div className="max-w-md mx-auto relative">
        <button
          onClick={() => navigate('/')}
          className="absolute -left-16 top-0 cyber-button flex items-center gap-2 bg-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
              <User className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-200">
                {user?.displayName}
              </h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {!user?.emailVerified && (
            <button
              onClick={handleVerifyEmail}
              className="w-full cyber-button mb-4 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Verify Email
            </button>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="cyber-input"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              className="w-full cyber-button bg-sky-500/20 hover:bg-sky-500/30"
            >
              Update Password
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="w-full cyber-button flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}