import React, { useRef } from 'react';
import { BankTask } from '../types/banking';
import { Download, Upload, Printer, X, FileSpreadsheet, ShieldCheck, FileJson } from 'lucide-react';

interface AuditExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: BankTask[];
  onImportTasks: (importedTasks: BankTask[]) => void;
}

export const AuditExportModal: React.FC<AuditExportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = [
      'Task ID',
      'Title',
      'Cadence',
      'Priority',
      'Status',
      'Category',
      'Deadline',
      'Dual Control Required',
      'Dual Verified By',
      'Completed At',
      'GL Reference',
      'Notes'
    ];

    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.cadence}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.category}"`,
      `"${t.deadlineTime || ''}"`,
      `"${t.requiresDualControl ? 'YES' : 'NO'}"`,
      `"${(t.verifiedBy || '').replace(/"/g, '""')}"`,
      `"${t.completedAt || ''}"`,
      `"${t.glAccountRef || ''}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Branch_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `branch_cadence_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTasks(parsed);
          alert(`Successfully imported ${parsed.length} tasks!`);
          onClose();
        } else {
          alert('Invalid file format: JSON must be an array of tasks.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Standalone Branch Audit Pack & Data Management
              </h2>
              <p className="text-xs text-slate-500">
                Zero external servers. Export local records or restore from previous files.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Export Options Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleExportCSV}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between"
            >
              <div>
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2" />
                <span className="font-bold text-slate-900 block">Export as CSV</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  Compatible with Microsoft Excel & Google Sheets for examiner pack.
                </span>
              </div>
              <span className="text-indigo-600 font-semibold text-[11px] mt-3 block">
                Download .CSV →
              </span>
            </button>

            <button
              onClick={handleExportJSON}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between"
            >
              <div>
                <FileJson className="w-5 h-5 text-indigo-600 mb-2" />
                <span className="font-bold text-slate-900 block">JSON Backup</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  Complete local state snapshot for offline backup or machine transfer.
                </span>
              </div>
              <span className="text-indigo-600 font-semibold text-[11px] mt-3 block">
                Save .JSON File →
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all flex flex-col justify-between"
            >
              <div>
                <Printer className="w-5 h-5 text-slate-700 mb-2" />
                <span className="font-bold text-slate-900 block">Print Summary</span>
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  Formatted physical hardcopy with branch manager signoff lines.
                </span>
              </div>
              <span className="text-indigo-600 font-semibold text-[11px] mt-3 block">
                Print Hardcopy →
              </span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">
              Restore / Import Existing Backup
            </span>
            <p className="text-slate-600 text-xs mb-3">
              Load a previously saved BranchCadence JSON backup file to restore task lists and verified records.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-xs shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Backup File (.json)</span>
            </button>
          </div>

          {/* Quick Record Table Preview */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-semibold text-slate-700 flex items-center justify-between text-xs">
              <span>Current Task Ledger Summary ({tasks.length} items)</span>
              <span className="font-mono text-slate-500 text-[11px]">
                {tasks.filter((t) => t.status === 'completed').length} Cleared
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50"
                >
                  <div className="truncate max-w-sm">
                    <span className="font-medium text-slate-900">{t.title}</span>
                    <span className="text-slate-400 ml-2 font-mono text-[11px]">{t.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        t.status === 'completed'
                          ? 'text-emerald-700'
                          : t.cadence === 'critical'
                          ? 'text-rose-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                    {t.verifiedBy && (
                      <span className="text-[11px] text-emerald-700">✓ Verified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
