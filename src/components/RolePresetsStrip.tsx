import React from 'react';
import { UserCheck, Shield, DollarSign, Briefcase } from 'lucide-react';

interface RolePresetsStripProps {
  activeRole: string;
  onSelectRole: (role: string) => void;
}

export const RolePresetsStrip: React.FC<RolePresetsStripProps> = ({
  activeRole,
  onSelectRole,
}) => {
  const roles = [
    {
      id: 'all_roles',
      name: 'Entire Branch View',
      icon: Briefcase,
      desc: 'All branch operations, vault, compliance, and loans',
    },
    {
      id: 'operations_lead',
      name: 'Operations Lead & Cashier',
      icon: DollarSign,
      desc: 'Daily vault opening, EOD cash balancing, clearing files',
    },
    {
      id: 'compliance_auditor',
      name: 'Compliance & Audit Officer',
      icon: Shield,
      desc: 'AML/CTR logs, OFAC flags, monthly GL close & safe deposit',
    },
    {
      id: 'credit_officer',
      name: 'Loan & Commercial Banker',
      icon: UserCheck,
      desc: 'Loan covenants, client KYC, collateral verification',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-xs font-semibold text-slate-700">
          Switch Banking Role Perspective:
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Customizes active categories and priority queues
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`text-left p-2.5 rounded-lg border transition-all text-xs flex items-start gap-2.5 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                  isActive ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600 shadow-xs'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold block truncate">{r.name}</span>
                <span
                  className={`text-[11px] block truncate mt-0.5 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {r.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
