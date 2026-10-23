import React from 'react';
import { Landmark, Plus, FileText, Lightbulb } from 'lucide-react';

interface TopBarProps {
  onNewTask: () => void;
  onOpenIdeas: () => void;
  onOpenExport: () => void;
  activeCadenceTab: string;
  onSelectCadenceTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNewTask,
  onOpenIdeas,
  onOpenExport,
  activeCadenceTab,
  onSelectCadenceTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <a href="#" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              BranchCadence
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectCadenceTab('all')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeCadenceTab === 'all' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              All Operations
            </button>
            <button
              onClick={() => onSelectCadenceTab('daily')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeCadenceTab === 'daily' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Daily Routine
            </button>
            <button
              onClick={() => onSelectCadenceTab('monthly')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeCadenceTab === 'monthly' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Monthly Close
            </button>
            <button
              onClick={() => onSelectCadenceTab('critical')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeCadenceTab === 'critical' ? 'text-slate-900 font-semibold text-rose-600' : ''
              }`}
            >
              Risk Flags
            </button>
            <button
              onClick={onOpenIdeas}
              className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Suggested Ideas</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenExport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Audit Pack & Standalone Data Export"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Audit Export</span>
            </button>
            <button
              onClick={onNewTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
