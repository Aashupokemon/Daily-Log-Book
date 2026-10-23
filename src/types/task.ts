export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type Status = 'pending' | 'in_progress' | 'completed';

export interface DailyTask {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  createdAt: string; // ISO string e.g. 2026-10-23T08:30:00Z
  targetDate?: string; // YYYY-MM-DD
  completedAt?: string;
}
