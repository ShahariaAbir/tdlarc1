import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { Task } from './types';
import { db } from './lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';

interface TaskStore {
  user: User | null;
  tasks: Task[];
  searchQuery: string;
  filterPriority: Task['priority'] | 'all';
  setUser: (user: User | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Task['priority'] | 'all') => void;
  clearCompletedTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      user: null,
      tasks: [],
      searchQuery: '',
      filterPriority: 'all',
      setUser: (user) => set({ user }),
      setTasks: (tasks) => set({ tasks }),
      addTask: async (task) => {
        const user = get().user;
        if (!user) return;

        const taskData = {
          ...task,
          userId: user.uid,
          createdAt: new Date(),
        };

        await addDoc(collection(db, 'tasks'), taskData);
      },
      updateTask: async (id, updatedTask) => {
        await updateDoc(doc(db, 'tasks', id), updatedTask);
      },
      deleteTask: async (id) => {
        await deleteDoc(doc(db, 'tasks', id));
      },
      reorderTasks: (tasks) => set({ tasks }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      clearCompletedTasks: async () => {
        const user = get().user;
        if (!user) return;

        const completedTasks = get().tasks.filter(task => task.status === 'done');
        await Promise.all(completedTasks.map(task => deleteDoc(doc(db, 'tasks', task.id))));
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ searchQuery: state.searchQuery, filterPriority: state.filterPriority }),
    }
  )
);