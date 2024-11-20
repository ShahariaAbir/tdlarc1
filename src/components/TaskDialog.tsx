import React, { useState } from 'react';
import { Task } from '../types';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  initialStatus: Task['status'];
}

export function TaskDialog({
  isOpen,
  onClose,
  onSubmit,
  initialStatus,
}: TaskDialogProps) {
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'medium',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task as Omit<Task, 'id' | 'createdAt'>);
    onClose();
    setTask({ title: '', description: '', status: initialStatus, priority: 'medium' });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-slide-in">
      <div className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="cyber-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="cyber-input"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={task.priority}
              onChange={(e) =>
                setTask({ ...task, priority: e.target.value as Task['priority'] })
              }
              className="cyber-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                onChange={(e) => {
                  const date = e.target.value;
                  const time = (task.dueDate instanceof Date) 
                    ? task.dueDate.toTimeString().slice(0, 5)
                    : '00:00';
                  const datetime = new Date(`${date}T${time}`);
                  setTask({ ...task, dueDate: datetime });
                }}
                className="cyber-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Due Time
              </label>
              <input
                type="time"
                onChange={(e) => {
                  const time = e.target.value;
                  const date = (task.dueDate instanceof Date)
                    ? task.dueDate.toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0];
                  const datetime = new Date(`${date}T${time}`);
                  setTask({ ...task, dueDate: datetime });
                }}
                className="cyber-input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cyber-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cyber-button bg-sky-500/20 hover:bg-sky-500/30"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}