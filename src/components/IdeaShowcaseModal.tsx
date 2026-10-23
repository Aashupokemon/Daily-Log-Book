import React from 'react';
import { AppIdea } from '../types/banking';
import { SYSTEM_IDEAS } from '../data/initialData';
import { Lightbulb, CheckCircle, ArrowRight, X, Shield, Sparkles } from 'lucide-react';

interface IdeaShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyIdeaView: (ideaId: string) => void;
  activeIdeaId?: string;
}

export const IdeaShowcaseModal: React.FC<IdeaShowcaseModalProps> = ({
  isOpen,
  onClose,
  onApplyIdeaView,
  activeIdeaId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                4 Architectural Ideas for Your Branch Task & Operations App
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Designed specifically for branch banking realities: separating daily opening/balancing rhythms, monthly regulatory/GL compliance, and critical risk escalations into a standalone system without external database dependencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYSTEM_IDEAS.map((idea) => {
            const isCurrent = activeIdeaId === idea.id;
            return (
              <div
                key={idea.id}
                className={`border rounded-xl p-5 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700 uppercase tracking-wider text-[11px]">
                      {idea.archetype}
                    </span>
                    {isCurrent && (
                      <span className="text-indigo-600 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active Demo View
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{idea.title}</h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{idea.subtitle}</p>

                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    {idea.tagline}
                  </p>

                  <div className="mt-3.5 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Key Capabilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {idea.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 block text-[11px]">Ideal Fit:</span>
                    <span className="text-slate-800 font-medium">{idea.idealFor}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">100% Standalone / Offline</span>
                  <button
                    onClick={() => {
                      onApplyIdeaView(idea.id);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isCurrent ? 'Viewing Now' : 'Try This Perspective'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Why Standalone Local-Storage Architecture Fits Bank Branches
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              Branch computers often have strict IT policies and firewalls. A zero-external-database design keeps all sensitive customer references inside the local browser sandbox, supports instant JSON/CSV exports for compliance packs, and works seamlessly during network outages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold whitespace-nowrap"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
