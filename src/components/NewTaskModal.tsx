import React, { useState, useEffect } from 'react';
import { BankTask, CadenceType, TaskPriority } from '../types/banking';
import { BANKING_CATEGORIES } from '../data/initialData';
import { X, Plus, Trash } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Partial<BankTask>) => void;
  taskToEdit?: BankTask | null;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cadence, setCadence] = useState<CadenceType>('daily');
  const [priority, setPriority] = useState<TaskPriority>('standard');
  const [category, setCategory] = useState('Cash & Vault');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [requiresDualControl, setRequiresDualControl] = useState(false);
  const [glAccountRef, setGlAccountRef] = useState('');
  const [notes, setNotes] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCadence(taskToEdit.cadence);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDeadlineTime(taskToEdit.deadlineTime || '');
      setRequiresDualControl(taskToEdit.requiresDualControl);
      setGlAccountRef(taskToEdit.glAccountRef || '');
      setNotes(taskToEdit.notes || '');
      setChecklistItems(taskToEdit.checklist || []);
    } else {
      setTitle('');
      setDescription('');
      setCadence('daily');
      setPriority('standard');
      setCategory('Cash & Vault');
      setDeadlineTime('09:00 AM');
      setRequiresDualControl(false);
      setGlAccountRef('');
      setNotes('');
      setChecklistItems([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems([
      ...checklistItems,
      {
        id: `sub-${Date.now()}`,
        title: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      cadence,
      priority,
      category,
      deadlineTime: deadlineTime.trim() || undefined,
      requiresDualControl,
      glAccountRef: glAccountRef.trim() || undefined,
      notes: notes.trim() || undefined,
      checklist: checklistItems,
      status: taskToEdit ? taskToEdit.status : 'pending',
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {taskToEdit ? 'Edit Banking Task' : 'Record New Branch Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify recurrence cadence, compliance dual-control, and SOP verification steps.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. End-of-Day Cash Drawer Balancing"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Procedure Summary / Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of operational procedure or regulatory requirement..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Cadence & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Recurrence Cadence</label>
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value as CadenceType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="daily">Daily Repeating (Morning/EOD)</option>
                <option value="monthly">Monthly Recurring (Close/Audit)</option>
                <option value="critical">Critical / Urgent Escalation</option>
                <option value="adhoc">Ad-hoc Customer / Branch Request</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Banking Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {BANKING_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority, Deadline & GL Account */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="standard">Standard</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical (Mandatory)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Deadline / Window</label>
              <input
                type="text"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                placeholder="e.g. 09:30 AM or Day 28"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">GL Account Ref (Optional)</label>
              <input
                type="text"
                value={glAccountRef}
                onChange={(e) => setGlAccountRef(e.target.value)}
                placeholder="e.g. GL-1010"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Dual-Control Toggle */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2.5">
            <input
              type="checkbox"
              id="dualControl"
              checked={requiresDualControl}
              onChange={(e) => setRequiresDualControl(e.target.checked)}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
            />
            <label htmlFor="dualControl" className="cursor-pointer">
              <span className="font-semibold text-amber-900 block">
                Requires Dual-Control Verification (Maker / Checker)
              </span>
              <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                Check this for vault operations, wire recalls, cash limits, and general ledger close that require a co-custodian signoff.
              </span>
            </label>
          </div>

          {/* Sub-Checklist (SOP Steps) */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Standard Operating Procedure (SOP) Steps
            </label>
            <div className="space-y-1.5 mb-2">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded border border-slate-200"
                >
                  <span className="text-slate-700">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add verifiable step (e.g., 'Inspect bill trap', 'Count $100 straps')..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Audit Notes / Initial Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pre-authorized by Branch Supervisor"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
            >
              {taskToEdit ? 'Save Changes' : 'Record Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
