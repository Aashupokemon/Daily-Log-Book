import React, { useState } from 'react';
import { BankTask } from '../types/banking';
import { ShieldCheck, X, AlertCircle } from 'lucide-react';

interface DualSignoffModalProps {
  task: BankTask | null;
  onClose: () => void;
  onConfirmSignoff: (taskId: string, verifierName: string, notes: string) => void;
}

export const DualSignoffModal: React.FC<DualSignoffModalProps> = ({
  task,
  onClose,
  onConfirmSignoff,
}) => {
  const [verifierName, setVerifierName] = useState('');
  const [verifierId, setVerifierId] = useState('');
  const [signoffNote, setSignoffNote] = useState('');

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifierName.trim()) return;

    const fullVerifier = verifierId.trim()
      ? `${verifierName.trim()} (${verifierId.trim()})`
      : verifierName.trim();

    onConfirmSignoff(task.id, fullVerifier, signoffNote.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Dual-Control Co-Signoff</h2>
              <p className="text-xs text-slate-500">Maker / Checker Audit Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 block">Task to Co-Verify:</span>
          <p className="text-slate-900 font-medium mt-0.5">{task.title}</p>
          <div className="mt-2 text-slate-500 flex items-center gap-2 font-mono text-[11px]">
            <span>Category: {task.category}</span>
            {task.glAccountRef && <span>· GL: {task.glAccountRef}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Co-Custodian / Verifier Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
              placeholder="e.g. M. Vance (Assistant Branch Mgr)"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Officer ID / Employee Badge (Optional)
            </label>
            <input
              type="text"
              value={verifierId}
              onChange={(e) => setVerifierId(e.target.value)}
              placeholder="e.g. OFF-8821"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Verification Notes / Observation
            </label>
            <textarea
              rows={2}
              value={signoffNote}
              onChange={(e) => setSignoffNote(e.target.value)}
              placeholder="e.g. Count confirmed in dual presence. Vault seal verified intact."
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify & Signoff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
