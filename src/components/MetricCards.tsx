import React from 'react';
import { BankTask } from '../types/banking';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MetricCardsProps {
  tasks: BankTask[];
  onSelectFilter: (cadence: string) => void;
  onOpenDailyReset: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  tasks,
  onSelectFilter,
  onOpenDailyReset,
}) => {
  const dailyTasks = tasks.filter((t) => t.cadence === 'daily');
  const dailyCompleted = dailyTasks.filter((t) => t.status === 'completed').length;
  const dailyRate = dailyTasks.length > 0 ? Math.round((dailyCompleted / dailyTasks.length) * 100) : 0;

  const monthlyTasks = tasks.filter((t) => t.cadence === 'monthly');
  const monthlyCompleted = monthlyTasks.filter((t) => t.status === 'completed').length;
  const monthlyRate = monthlyTasks.length > 0 ? Math.round((monthlyCompleted / monthlyTasks.length) * 100) : 0;

  const criticalTasks = tasks.filter(
    (t) => (t.cadence === 'critical' || t.priority === 'critical') && t.status !== 'completed'
  );

  const dualControlTasks = tasks.filter((t) => t.requiresDualControl);
  const dualVerified = dualControlTasks.filter((t) => !!t.verifiedBy).length;

  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const isMonthEndWindow = dayOfMonth >= 25;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Daily Operations Card */}
      <div
        onClick={() => onSelectFilter('daily')}
        className="bg-white border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-slate-700">Daily Routine Progress</span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {dailyCompleted}/{dailyTasks.length}
            </span>
            <span className="text-xs text-slate-500">done</span>
          </div>
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700">
            {dailyRate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${dailyRate}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>EOD Cash Balancing</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDailyReset();
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            End Day Rollover →
          </button>
        </div>
      </div>

      {/* 2. Monthly Close Cycle */}
      <div
        onClick={() => onSelectFilter('monthly')}
        className="bg-white border border-slate-200 rounded-xl p-4.5 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-slate-700">Monthly Regulatory Close</span>
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {monthlyCompleted}/{monthlyTasks.length}
            </span>
            <span className="text-xs text-slate-500">audits</span>
          </div>
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700">
            {monthlyRate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${monthlyRate}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>Day {dayOfMonth} of {daysInMonth}</span>
          <span className={isMonthEndWindow ? 'text-amber-600 font-medium' : 'text-slate-500'}>
            {isMonthEndWindow ? 'Month-End Window Active' : 'Mid-Month Routine'}
          </span>
        </div>
      </div>

      {/* 3. Critical & Escalated Risk Flags */}
      <div
        onClick={() => onSelectFilter('critical')}
        className={`bg-white border rounded-xl p-4.5 cursor-pointer transition-all shadow-xs ${
          criticalTasks.length > 0 ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-slate-700">Critical & Escalations</span>
          <AlertTriangle
            className={`w-4 h-4 ${criticalTasks.length > 0 ? 'text-rose-500' : 'text-slate-400'}`}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                criticalTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {criticalTasks.length}
            </span>
            <span className="text-xs text-slate-500">action items</span>
          </div>
          <span className="text-xs text-slate-600 font-medium">
            {criticalTasks.length > 0 ? 'Urgent Review' : 'Nominal'}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              criticalTasks.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${criticalTasks.length > 0 ? 100 : 0}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>AML, Wires & Vault Alerts</span>
          <span className={criticalTasks.length > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'}>
            {criticalTasks.length > 0 ? 'Requires Action' : 'All Clear'}
          </span>
        </div>
      </div>

      {/* 4. Dual-Control Compliance */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-slate-700">Dual-Custody Signoffs</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {dualVerified}/{dualControlTasks.length}
            </span>
            <span className="text-xs text-slate-500">co-verified</span>
          </div>
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700">
            {dualControlTasks.length > 0 ? Math.round((dualVerified / dualControlTasks.length) * 100) : 100}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${dualControlTasks.length > 0 ? (dualVerified / dualControlTasks.length) * 100 : 100}%`,
            }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>Maker / Checker Rules</span>
          <span className="text-slate-700 font-medium">Standalone Log</span>
        </div>
      </div>
    </div>
  );
};
