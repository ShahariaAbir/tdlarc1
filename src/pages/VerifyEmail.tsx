import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useTaskStore } from '../store';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();
  const user = useTaskStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.emailVerified) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      user.reload().then(() => {
        if (user.emailVerified) {
          navigate('/');
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResendEmail = async () => {
    if (!user || timeLeft > 0) return;

    try {
      setLoading(true);
      await sendEmailVerification(user);
      setTimeLeft(60);
      toast.success('Verification email sent!');
    } catch (err) {
      toast.error('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="cyber-gradient" />
      
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
          <Mail className="w-16 h-16 text-sky-400 mx-auto mb-6" />
          
          <h1 className="text-2xl font-bold text-slate-200 mb-4">
            Verify your email
          </h1>
          
          <p className="text-slate-400 mb-6">
            We've sent a verification email to <strong>{user.email}</strong>.
            Please check your inbox and click the verification link.
          </p>

          <button
            onClick={handleResendEmail}
            disabled={loading || timeLeft > 0}
            className="w-full cyber-button bg-sky-500/20 hover:bg-sky-500/30 disabled:opacity-50"
          >
            {timeLeft > 0
              ? `Resend email in ${timeLeft}s`
              : loading
              ? 'Sending...'
              : 'Resend verification email'}
          </button>
        </div>
      </div>
    </div>
  );
}