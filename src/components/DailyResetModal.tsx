import React, { useState } from 'react';
import { BankTask } from '../types/banking';
import { RefreshCw, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface DailyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: BankTask[];
  onConfirmRollover: (signoffOfficer: string) => void;
}

export const DailyResetModal: React.FC<DailyResetModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onConfirmRollover,
}) => {
  const [officerName, setOfficerName] = useState('');

  if (!isOpen) return null;

  const dailyTasks = tasks.filter((t) => t.cadence === 'daily');
  const completedDaily = dailyTasks.filter((t) => t.status === 'completed').length;
  const pendingDaily = dailyTasks.length - completedDaily;
  const criticalPending = tasks.filter(
    (t) => (t.cadence === 'critical' || t.priority === 'critical') && t.status !== 'completed'
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName.trim()) return;
    onConfirmRollover(officerName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">End-of-Day Balancing & Rollover</h2>
              <p className="text-xs text-slate-500">Close today's branch ledger and prepare tomorrow's runbook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          {/* Status audit recap */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Daily Routine Status</span>
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {completedDaily}/{dailyTasks.length} Completed
              </span>
              {pendingDaily > 0 ? (
                <span className="text-amber-600 font-medium block text-[11px] mt-0.5">
                  ⚠️ {pendingDaily} tasks uncompleted
                </span>
              ) : (
                <span className="text-emerald-600 font-medium block text-[11px] mt-0.5">
                  ✓ 100% daily tasks cleared
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Critical & AML Flags</span>
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {criticalPending} Open
              </span>
              {criticalPending > 0 ? (
                <span className="text-rose-600 font-medium block text-[11px] mt-0.5">
                  Action required before close
                </span>
              ) : (
                <span className="text-emerald-600 font-medium block text-[11px] mt-0.5">
                  ✓ No open risk blocks
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-700 text-xs">
            <span className="font-semibold text-blue-900 block mb-1">How Rollover Works:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Daily tasks:</strong> Sub-checklists and statuses will reset to pending for the next business morning.
              </li>
              <li>
                <strong>Monthly & Critical tasks:</strong> Kept in their current status with zero disruption.
              </li>
              <li>
                <strong>Historical record:</strong> Today's audit timestamp and completion status are recorded in local storage.
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Closing Supervisor / Cashier Signoff <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="e.g. A. Gupta (Operations Lead)"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirm EOD Rollover</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
