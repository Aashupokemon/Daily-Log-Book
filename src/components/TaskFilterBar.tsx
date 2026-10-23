import React from 'react';
import { Search, Filter, RefreshCw, Lightbulb, X } from 'lucide-react';
import { CadenceType } from '../types/banking';
import { BANKING_CATEGORIES } from '../data/initialData';

interface TaskFilterBarProps {
  activeCadence: string;
  onCadenceChange: (cadence: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDailyReset: () => void;
  onOpenIdeas: () => void;
  counts: Record<string, number>;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  activeCadence,
  onCadenceChange,
  selectedCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onOpenDailyReset,
  onOpenIdeas,
  counts,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-6 space-y-3 shadow-xs">
      {/* Top Row: Segmented Cadence Controls & Quick Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Cadence segmented controls (functional buttons with click handlers) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => onCadenceChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCadence === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Workflows ({counts.all || 0})
          </button>
          <button
            onClick={() => onCadenceChange('daily')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCadence === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Routine ({counts.daily || 0})
          </button>
          <button
            onClick={() => onCadenceChange('monthly')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCadence === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Recurrence ({counts.monthly || 0})
          </button>
          <button
            onClick={() => onCadenceChange('critical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCadence === 'critical'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-rose-600 hover:text-rose-900'
            }`}
          >
            Critical Flags ({counts.critical || 0})
          </button>
          <button
            onClick={() => onCadenceChange('adhoc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeCadence === 'adhoc'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ad-hoc ({counts.adhoc || 0})
          </button>
        </div>

        {/* Quick banker action triggers */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onOpenDailyReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Perform End-of-Day cash balancing and rollover daily checklists to tomorrow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Daily EOD Rollover</span>
          </button>
          <button
            onClick={onOpenIdeas}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            <span>Compare 4 System Ideas</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Search, Category Filter, and Status Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, SOP steps, notes, or GL references (e.g. 'vault', 'GL-1010', 'AML')..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="relative min-w-[150px] w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full text-xs py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {BANKING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[130px] w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full text-xs py-1.5 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
