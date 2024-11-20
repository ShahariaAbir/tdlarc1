import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthForm } from '../components/AuthForm';
import { useTaskStore } from '../store';
import toast from 'react-hot-toast';

export function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useTaskStore((state) => state.setUser);

  const handleLogin = async ({ email, password }: { email: string; password?: string }) => {
    if (!password) return;
    
    try {
      setLoading(true);
      setError('');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser(user);
      
      if (!user.emailVerified) {
        navigate('/verify-email');
        return;
      }

      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} error={error} loading={loading} />;
}