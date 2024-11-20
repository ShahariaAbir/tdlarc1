import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from '../components/TaskColumn';
import { TaskDialog } from '../components/TaskDialog';
import { SearchBar } from '../components/SearchBar';
import { useTaskStore } from '../store';
import { Task } from '../types';
import { ClipboardList } from 'lucide-react';

export function TaskBoard() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    clearCompletedTasks,
    searchQuery,
    filterPriority,
  } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>('todo');

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    const activeIndex = tasks.indexOf(activeTask);
    const overIndex = tasks.indexOf(overTask);

    if (activeIndex !== overIndex) {
      reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    if (overId === activeTask.status) return;

    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      updateTask(activeTask.id, { status: overId });
    }
  };

  const handleAddTask = (status: Task['status']) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="cyber-gradient" />
      
      <main className="max-w-7xl mx-auto px-4 py-4">
        <SearchBar />
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col md:flex-row gap-4 md:h-[calc(100vh-12rem)] h-auto">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={inProgressTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
            <TaskColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              onAddTask={handleAddTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        </DndContext>
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={(task) => addTask({ ...task, status: selectedStatus })}
        initialStatus={selectedStatus}
      />
    </div>
  );
}