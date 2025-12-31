
import React, { useState } from 'react';
import { Plus, Bell, Circle, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface MicroTasksProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
}

export const MicroTasks: React.FC<MicroTasksProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-extrabold text-slate-700 tracking-tight">Micro-Tasks</h3>
        <Bell size={18} className="text-slate-300" />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Small step..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-teal-100 placeholder:text-slate-300"
        />
        <button type="submit" className="p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 shadow-md">
          <Plus size={20} strokeWidth={3} />
        </button>
      </form>

      <div className="space-y-2 max-h-44 overflow-y-auto custom-scroll pr-1">
        {tasks.length === 0 ? (
          <p className="text-slate-300 text-xs font-medium italic text-center py-4">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-transparent text-left hover:border-teal-100 transition-all"
            >
              {task.completed ? <CheckCircle2 size={16} className="text-teal-500" /> : <Circle size={16} className="text-slate-200" />}
              <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
