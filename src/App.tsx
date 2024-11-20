import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useTaskStore } from './store';
import { AuthLayout } from './components/AuthLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { TaskBoard } from './pages/TaskBoard';
import { VerifyEmail } from './pages/VerifyEmail';
import { User } from 'lucide-react';

function App() {
  const setUser = useTaskStore((state) => state.setUser);
  const setTasks = useTaskStore((state) => state.setTasks);
  const user = useTaskStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (!user) {
        setTasks([]);
        return;
      }

      // Subscribe to user's tasks
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );

      const unsubscribeTasks = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          dueDate: doc.data().dueDate?.toDate(),
        }));
        setTasks(tasks);
      });

      return () => unsubscribeTasks();
    });

    return () => unsubscribe();
  }, [setUser, setTasks]);

  return (
    <BrowserRouter>
      {user && user.emailVerified && (
        <div className="fixed top-4 right-4 z-50">
          <Link
            to="/profile"
            className="cyber-button flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user.displayName}</span>
          </Link>
        </div>
      )}

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<TaskBoard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;