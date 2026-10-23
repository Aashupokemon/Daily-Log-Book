export type CadenceType = 'daily' | 'monthly' | 'critical' | 'adhoc';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'standard';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'flagged';

export type BankRolePreset = 'operations_lead' | 'vault_teller' | 'credit_officer' | 'compliance_auditor';

export interface SubCheckItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface BankTask {
  id: string;
  title: string;
  description: string;
  cadence: CadenceType;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  deadlineTime?: string; // e.g. "09:30 AM" or "Day 28"
  dueMonthDay?: number; // e.g. 25th of month
  requiresDualControl: boolean;
  verifiedBy?: string; // Checker ID / initials
  completedAt?: string;
  completedBy?: string;
  checklist: SubCheckItem[];
  notes?: string;
  glAccountRef?: string; // e.g. GL-1020 Cash on Hand
  createdAt: string;
}

export interface BranchDaySummary {
  date: string;
  totalDaily: number;
  completedDaily: number;
  totalMonthly: number;
  completedMonthly: number;
  criticalPending: number;
  eodBalanced: boolean;
  signoffUser: string;
}

export interface AppIdea {
  id: string;
  title: string;
  subtitle: string;
  archetype: string;
  tagline: string;
  focusArea: string;
  strengths: string[];
  idealFor: string;
  workflowOverview: string;
}
