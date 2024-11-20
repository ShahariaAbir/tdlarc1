import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTaskStore } from '../store';
import { Task } from '../types';
import clsx from 'clsx';

export function SearchBar() {
  const { searchQuery, setSearchQuery, filterPriority, setFilterPriority } = useTaskStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="cyber-input pl-10"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | 'all')}
          className="cyber-input pl-10 pr-8 appearance-none w-full"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
    </div>
  );
}