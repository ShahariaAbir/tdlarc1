import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthForm } from '../components/AuthForm';
import { useTaskStore } from '../store';
import toast from 'react-hot-toast';

export function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useTaskStore((state) => state.setUser);

  const handleRegister = async ({ 
    email, 
    password, 
    username 
  }: { 
    email: string; 
    password?: string; 
    username?: string 
  }) => {
    if (!password || !username) return;
    
    try {
      setLoading(true);
      setError('');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      setUser(user);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email');
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} error={error} loading={loading} />;
}