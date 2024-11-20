import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import clsx from 'clsx';

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSubmit: (data: { email: string; password?: string; username?: string }) => void;
  error?: string;
  loading?: boolean;
}

export function AuthForm({ type, onSubmit, error, loading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, username });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="cyber-gradient" />
      
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ClipboardList className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-200">
            {type === 'login' ? 'Welcome Back' : type === 'register' ? 'Create Account' : 'Reset Password'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="Enter your email"
            />
          </div>

          {type !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input"
                placeholder="Enter your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              'w-full cyber-button bg-sky-500/20 hover:bg-sky-500/30',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Please wait...' : type === 'login' ? 'Sign In' : type === 'register' ? 'Sign Up' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-400 hover:text-sky-300">
                Sign Up
              </Link>
            </>
          ) : type === 'register' ? (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300">
                Sign In
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-sky-400 hover:text-sky-300">
              Back to Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}