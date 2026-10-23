import React, { useState } from 'react';
import { BankTask, TaskStatus, SubCheckItem } from '../types/banking';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Trash2,
  MessageSquare,
  FileCheck2,
} from 'lucide-react';

interface TaskCardProps {
  task: BankTask;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onToggleSubCheck: (taskId: string, subId: string) => void;
  onOpenDualSignoff: (task: BankTask) => void;
  onEditTask: (task: BankTask) => void;
  onDeleteTask: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onToggleSubCheck,
  onOpenDualSignoff,
  onEditTask,
  onDeleteTask,
  onUpdateNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes || '');

  const completedChecklistCount = task.checklist.filter((item) => item.completed).length;
  const isAllChecklistDone =
    task.checklist.length > 0 && completedChecklistCount === task.checklist.length;

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notesDraft);
    setIsEditingNotes(false);
  };

  const getStatusBorder = () => {
    if (task.status === 'completed') return 'border-emerald-200 bg-white';
    if (task.cadence === 'critical' || task.priority === 'critical')
      return 'border-rose-200 bg-white';
    if (task.status === 'in_progress') return 'border-amber-200 bg-white';
    return 'border-slate-200 bg-white';
  };

  const getCadenceLabel = () => {
    switch (task.cadence) {
      case 'daily':
        return 'Daily Routine';
      case 'monthly':
        return 'Monthly Recurrence';
      case 'critical':
        return 'Critical Escalation';
      case 'adhoc':
        return 'Ad-hoc Priority';
    }
  };

  return (
    <div
      className={`border rounded-xl transition-all shadow-xs ${getStatusBorder()} hover:border-slate-300 p-4`}
    >
      {/* Top Header Row: Clean unboxed metadata with typographic separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-700">{task.category}</span>
          <span aria-hidden="true">·</span>
          <span>{getCadenceLabel()}</span>
          {task.deadlineTime && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-600">
                <Clock className="w-3 h-3 text-slate-400" />
                {task.deadlineTime}
              </span>
            </>
          )}
          {task.glAccountRef && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-500">{task.glAccountRef}</span>
            </>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className={`text-xs font-medium py-1 px-2 rounded-md border focus:outline-none ${
              task.status === 'completed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : task.status === 'in_progress'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : task.status === 'flagged'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Main Task Title & Action */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <button
            onClick={() =>
              onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')
            }
            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
            title={task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
            )}
          </button>
          <div>
            <h3
              className={`text-sm font-semibold text-slate-900 leading-snug ${
                task.status === 'completed' ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={() => onEditTask(task)}
            className="p-1 hover:text-slate-600 rounded transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-1 hover:text-rose-600 rounded transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Banking Compliance Details: Dual-Control & Checklist */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Dual Custody / Maker-Checker Info */}
        <div className="flex items-center gap-2">
          {task.requiresDualControl ? (
            task.verifiedBy ? (
              <div className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dual-Verified: {task.verifiedBy}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Dual-Control Pending</span>
                </span>
                <button
                  onClick={() => onOpenDualSignoff(task)}
                  className="px-2 py-0.5 text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-800 rounded transition-colors"
                >
                  Sign As Co-Custodian
                </button>
              </div>
            )
          ) : (
            <span className="text-slate-400">Single Custody</span>
          )}
        </div>

        {/* Right: Sub-items count & expand trigger */}
        <div className="flex items-center gap-3">
          {task.checklist.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono tabular-nums">
                {completedChecklistCount}/{task.checklist.length} SOP Steps
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          )}

          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{task.notes ? 'Notes' : 'Add Note'}</span>
          </button>
        </div>
      </div>

      {/* Expanded SOP Sub-Checklist */}
      {isExpanded && task.checklist.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-150">
          <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Standard Operating Procedure Verification Checklist:</span>
            <span className="font-mono tabular-nums text-slate-500 text-[11px]">
              {Math.round((completedChecklistCount / task.checklist.length) * 100)}% verified
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            {task.checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleSubCheck(task.id, item.id)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-slate-400 border-slate-300"
                />
                <span className={item.completed ? 'line-through text-slate-400' : ''}>
                  {item.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section or Notes Editor */}
      {(task.notes || isEditingNotes) && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs">
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add audit notes, exception details, or ticket reference..."
                className="w-full p-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-600 bg-slate-50/60 p-2 rounded border border-slate-100 font-mono text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-700 font-sans">Audit Note: </span>
              {task.notes}
            </div>
          )}
        </div>
      )}

      {/* Completed timestamp footer if completed */}
      {task.completedAt && (
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono tabular-nums">
          <span>Completed: {task.completedAt}</span>
          {task.completedBy && <span>· By: {task.completedBy}</span>}
        </div>
      )}
    </div>
  );
};
