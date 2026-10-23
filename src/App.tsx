/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DailyTask, Priority, Status } from './types/task';
import { usePWAInstall } from './hooks/usePWAInstall';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Download,
  Calendar,
  Smartphone,
  AlertTriangle
} from 'lucide-react';

const STORAGE_KEY = 'simple_daily_tasks_v2';

// Helper to format ISO date to readable string
function formatCreationDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return isoString;
  }
}

// Helper to get YYYY-MM-DD
function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const INITIAL_TASKS: DailyTask[] = [
  {
    id: 't-1',
    title: 'Morning cash vault opening & dual verification',
    priority: 'critical',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    targetDate: getTodayString(),
  },
  {
    id: 't-2',
    title: 'Reconcile ATM cash deposit cassettes',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    targetDate: getTodayString(),
  },
  {
    id: 't-3',
    title: 'Review wire transfer stop-payment exception',
    priority: 'critical',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    targetDate: getTodayString(),
  },
  {
    id: 't-4',
    title: 'Prepare monthly GL accruals and balance sheet report',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    targetDate: getTodayString(),
  },
];

export default function App() {
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // Task input state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDate, setNewTaskDate] = useState<string>(getTodayString());

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | string>('all');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingDate, setEditingDate] = useState('');

  // Android APK Modal
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const inputRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Focus input on initial mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    // Use current time combined with selected date
    const now = new Date();
    const selectedDateParts = newTaskDate.split('-');
    let createdAtISO = now.toISOString();

    if (selectedDateParts.length === 3) {
      const targetDateObj = new Date(
        parseInt(selectedDateParts[0]),
        parseInt(selectedDateParts[1]) - 1,
        parseInt(selectedDateParts[2]),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
      createdAtISO = targetDateObj.toISOString();
    }

    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: trimmed,
      priority: newTaskPriority,
      status: 'pending',
      targetDate: newTaskDate,
      createdAt: createdAtISO,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    inputRef.current?.focus();
  };

  const handleToggleStatus = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const nextStatus: Status = task.status === 'completed' ? 'pending' : 'completed';
          return {
            ...task,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const handleStatusChange = (id: string, status: Status) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const handlePriorityChange = (id: string, priority: Priority) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, priority };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleStartEdit = (task: DailyTask) => {
    setEditingId(task.id);
    setEditingText(task.title);
    setEditingDate(task.targetDate || task.createdAt.slice(0, 10));
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (trimmed) {
      setTasks(
        tasks.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              title: trimmed,
              targetDate: editingDate || t.targetDate,
            };
          }
          return t;
        })
      );
    }
    setEditingId(null);
  };

  const handleClearCompleted = () => {
    if (window.confirm('Clear all completed tasks?')) {
      setTasks(tasks.filter((t) => t.status !== 'completed'));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Task', 'Priority', 'Status', 'Date of Creation', 'Time Created', 'Completed At'];
    const rows = tasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.priority.toUpperCase(),
      t.status.toUpperCase(),
      new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      t.completedAt
        ? `${new Date(t.completedAt).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })} ${new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily_tasks_${getTodayString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    const today = getTodayString();
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (dateFilter === 'today') {
        const taskDay = task.targetDate || task.createdAt.slice(0, 10);
        if (taskDay !== today) return false;
      }
      if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, dateFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      critical: tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed').length,
    };
  }, [tasks]);

  const priorityStyles: Record<Priority, { label: string; text: string; bg: string; border: string }> = {
    critical: { label: 'Critical', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    high: { label: 'High', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    medium: { label: 'Medium', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    low: { label: 'Low', text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  };

  const statusStyles: Record<Status, { label: string; text: string; bg: string }> = {
    pending: { label: 'Pending', text: 'text-slate-700', bg: 'bg-slate-100' },
    in_progress: { label: 'In Progress', text: 'text-amber-800', bg: 'bg-amber-100' },
    completed: { label: 'Done', text: 'text-emerald-800', bg: 'bg-emerald-100' },
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Daily Task Logger
              </h1>
              <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                {todayFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Android APK Button */}
            <button
              onClick={() => {
                if (isInstallable) {
                  install();
                } else {
                  setIsAndroidModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Install as Android APK / Native Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isInstalled ? 'App Installed' : 'Android APK'}</span>
            </button>

            {counts.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                Clear Done ({counts.completed})
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium whitespace-nowrap"
              title="Download tasks with creation dates as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Simple Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-xs text-slate-500 block">Total Tasks</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {counts.total}
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-xs text-slate-500 block">Pending / In Progress</span>
            <span className="text-xl font-bold font-mono tabular-nums text-amber-600">
              {counts.pending + counts.in_progress}
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-xs text-slate-500 block">Completed</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-600">
              {counts.completed}
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-xs text-slate-500 block">Critical</span>
            <span
              className={`text-xl font-bold font-mono tabular-nums ${
                counts.critical > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {counts.critical}
            </span>
          </div>
        </div>

        {/* Enter Task On Your Own (Primary Input Form with Creation Date & Priority) */}
        <form
          onSubmit={handleAddTask}
          className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter new task description and press Enter..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Optional Date Picker (defaults to Today) */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="text-xs font-mono bg-transparent text-slate-700 focus:outline-none"
                title="Task Creation Date"
              />
            </div>

            {/* Priority Selector */}
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              title="Set Priority"
            >
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">⚪ Low</option>
            </select>

            {/* Add Button */}
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </form>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Status Filter Tabs (functional segmented controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({counts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({counts.in_progress})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Done ({counts.completed})
            </button>
          </div>

          {/* Priority, Date filter & quick search */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 w-32 sm:w-40"
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-xs">
              <p className="text-sm font-semibold text-slate-800">No tasks found</p>
              <p className="text-xs text-slate-500 mt-1">
                {tasks.length === 0
                  ? 'Your list is empty. Enter a task description above to log it!'
                  : 'No tasks match your selected filter.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isEditing = editingId === task.id;
              const pStyle = priorityStyles[task.priority];
              const sStyle = statusStyles[task.status];
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`bg-white border rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all shadow-xs ${
                    isCompleted
                      ? 'border-slate-200 bg-slate-50/50 opacity-80'
                      : task.priority === 'critical'
                      ? 'border-rose-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: Checkmark & Title + Explicit Creation Date */}
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(task.id)}
                      className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>

                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(task.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="flex-1 px-2.5 py-1 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                        <input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          className="px-2 py-1 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <span
                          onDoubleClick={() => handleStartEdit(task)}
                          className={`text-sm font-medium block truncate cursor-pointer ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                          title="Double-click to edit text"
                        >
                          {task.title}
                        </span>

                        {/* Explicit Date of Task Creation mentioned */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Created: {formatCreationDate(task.createdAt)}
                          </span>

                          {task.completedAt && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-emerald-600 font-medium">
                                Completed: {formatCreationDate(task.completedAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Selectors for Priority and Status + Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Priority Selector */}
                    <select
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(task.id, e.target.value as Priority)}
                      className={`text-xs font-semibold py-1 px-2 rounded-md border focus:outline-none ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                      title="Change priority"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    {/* Status Selector */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                      className={`text-xs font-medium py-1 px-2 rounded-md border border-slate-200 focus:outline-none ${sStyle.bg} ${sStyle.text}`}
                      title="Change status"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Done</option>
                    </select>

                    {/* Edit & Delete actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-1 text-slate-400 ml-1">
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="p-1 hover:text-slate-600 rounded"
                          title="Edit task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 hover:text-rose-600 rounded"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clean Footer Note with Android APK quick trigger */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Simple Daily Task Logger · Saved automatically in browser · Standalone</span>
          <button
            onClick={() => setIsAndroidModalOpen(true)}
            className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install on Android Phone</span>
          </button>
        </div>
      </main>

      {/* Android Install & APK Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        onInstallPrompt={install}
        isInstallable={isInstallable}
      />
    </div>
  );
}
