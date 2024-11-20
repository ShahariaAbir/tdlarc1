import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthForm } from '../components/AuthForm';
import toast from 'react-hot-toast';

export function ResetPassword() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async ({ email }: { email: string }) => {
    try {
      setLoading(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="reset" onSubmit={handleReset} error={error} loading={loading} />;
}