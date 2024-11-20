import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTaskStore } from '../store';

export function AuthLayout() {
  const user = useTaskStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}