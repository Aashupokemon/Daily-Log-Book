import { BankTask, AppIdea } from '../types/banking';

export const INITIAL_BANK_TASKS: BankTask[] = [
  // DAILY REPEATING
  {
    id: 'task-daily-1',
    title: 'Dual-Custody Vault Opening & Alarm Deactivation',
    description: 'Inspect vault perimeter, verify time-lock release with co-custodian, and log opening timestamp.',
    cadence: 'daily',
    priority: 'critical',
    status: 'completed',
    category: 'Cash & Vault',
    deadlineTime: '08:30 AM',
    requiresDualControl: true,
    completedAt: '08:24 AM',
    completedBy: 'A. Gupta (Head Cashier)',
    verifiedBy: 'M. Vance (Branch Mgr)',
    glAccountRef: 'GL-1001 Cash Vault',
    checklist: [
      { id: 'sub-1', title: 'Verify perimeter & electronic time locks undamaged', completed: true },
      { id: 'sub-2', title: 'Dual-combination entry with Custodian B', completed: true },
      { id: 'sub-3', title: 'Log physical vault register book signoff', completed: true }
    ],
    notes: 'Time lock opened normally. Cash physical seal #4892 intact.',
    createdAt: '2026-10-23T08:00:00Z'
  },
  {
    id: 'task-daily-2',
    title: 'ATM Cash Replenishment & Journal Audit',
    description: 'Verify cash cassette totals, inspect skimming guard, and tie electronic journal to physical cash count.',
    cadence: 'daily',
    priority: 'high',
    status: 'in_progress',
    category: 'Cash & Vault',
    deadlineTime: '09:15 AM',
    requiresDualControl: true,
    checklist: [
      { id: 'sub-4', title: 'Inspect external fascia for skimming devices or glue', completed: true },
      { id: 'sub-5', title: 'Remove purge tray & tally rejected banknotes', completed: true },
      { id: 'sub-6', title: 'Balance cassette terminal totals against host ledger', completed: false }
    ],
    glAccountRef: 'GL-1030 ATM Currency',
    notes: 'ATM #2 cassette 3 replaced with $40,000 fit bills.',
    createdAt: '2026-10-23T08:15:00Z'
  },
  {
    id: 'task-daily-3',
    title: 'In-Clearing & Settlement Batch Verification',
    description: 'Reconcile morning check clearing files, check for return items or stop-payment notices before clearing cutoff.',
    cadence: 'daily',
    priority: 'high',
    status: 'pending',
    category: 'Clearing & Settlement',
    deadlineTime: '11:00 AM',
    requiresDualControl: false,
    checklist: [
      { id: 'sub-7', title: 'Download central clearing house report', completed: false },
      { id: 'sub-8', title: 'Check stop-payment match queue', completed: false },
      { id: 'sub-9', title: 'Approve batch post to host core banking', completed: false }
    ],
    createdAt: '2026-10-23T08:30:00Z'
  },
  {
    id: 'task-daily-4',
    title: 'High-Value Currency Transaction Log Check (> $10k)',
    description: 'Compile and cross-examine teller currency logs for aggregate transactions requiring CTR / Form 8300 filing.',
    cadence: 'daily',
    priority: 'critical',
    status: 'pending',
    category: 'AML & Compliance',
    deadlineTime: '02:30 PM',
    requiresDualControl: true,
    checklist: [
      { id: 'sub-10', title: 'Extract all aggregate cash transactions >= $10,000', completed: false },
      { id: 'sub-11', title: 'Verify customer identification and occupation logged', completed: false },
      { id: 'sub-12', title: 'Queue for branch compliance officer signoff', completed: false }
    ],
    createdAt: '2026-10-23T09:00:00Z'
  },
  {
    id: 'task-daily-5',
    title: 'End-of-Day Teller Cash Balancing & Difference Log',
    description: 'All teller stations must strike daily balance sheet, tie out physical drawer cash to host, and report any variance.',
    cadence: 'daily',
    priority: 'critical',
    status: 'pending',
    category: 'Cash & Vault',
    deadlineTime: '04:45 PM',
    requiresDualControl: true,
    glAccountRef: 'GL-1010 Teller Cash',
    checklist: [
      { id: 'sub-13', title: 'Tellers 1 through 4 submit signed cash sheets', completed: false },
      { id: 'sub-14', title: 'Zero variance verification or log over/short slip', completed: false },
      { id: 'sub-15', title: 'Return excess cash to main vault compartment', completed: false },
      { id: 'sub-16', title: 'Co-lock vault and engage digital delay timers', completed: false }
    ],
    createdAt: '2026-10-23T09:00:00Z'
  },

  // MONTHLY RECURRING
  {
    id: 'task-monthly-1',
    title: 'General Ledger Subledger Tie-Out & Accruals',
    description: 'Monthly reconciliation of branch suspense accounts, interest accruals, cashier check clearing, and inter-branch balances.',
    cadence: 'monthly',
    priority: 'critical',
    status: 'in_progress',
    category: 'Finance & GL',
    dueMonthDay: 28,
    deadlineTime: 'Day 28 of month',
    requiresDualControl: true,
    glAccountRef: 'GL-9000 Balance Sheet',
    checklist: [
      { id: 'sub-17', title: 'Reconcile Cashier Checks Outstanding register', completed: true },
      { id: 'sub-18', title: 'Investigate branch suspense items > 15 days old', completed: true },
      { id: 'sub-19', title: 'Obtain branch manager monthly certification', completed: false }
    ],
    notes: '2 suspense items traced to ATM deposit dispute #9142, resolved.',
    createdAt: '2026-10-01T09:00:00Z'
  },
  {
    id: 'task-monthly-2',
    title: 'Dormant & Inactive Account Periodic Review',
    description: 'Inspect accounts crossing 24-month inactivity threshold. Ensure fee freeze and prepare pre-escheatment notices.',
    cadence: 'monthly',
    priority: 'medium',
    status: 'pending',
    category: 'Accounts & KYC',
    dueMonthDay: 15,
    deadlineTime: 'Day 15 of month',
    requiresDualControl: false,
    checklist: [
      { id: 'sub-20', title: 'Pull inactive deposit account register', completed: false },
      { id: 'sub-21', title: 'Verify dormant status restrictions applied', completed: false },
      { id: 'sub-22', title: 'Send statutory contact letters to account holders', completed: false }
    ],
    createdAt: '2026-10-01T09:00:00Z'
  },
  {
    id: 'task-monthly-3',
    title: 'Safe Deposit Box Master Register & Physical Inspection',
    description: 'Audit dual-key integrity, review access signature cards for the past 30 days, and audit drilled box custody records.',
    cadence: 'monthly',
    priority: 'high',
    status: 'pending',
    category: 'Operations',
    dueMonthDay: 20,
    deadlineTime: 'Day 20 of month',
    requiresDualControl: true,
    checklist: [
      { id: 'sub-23', title: 'Count unused keys in dual-custody safe', completed: false },
      { id: 'sub-24', title: 'Sample 20 customer access slips against signature cards', completed: false },
      { id: 'sub-25', title: 'Inspect vault ventilation and humidity sensors', completed: false }
    ],
    createdAt: '2026-10-01T09:00:00Z'
  },
  {
    id: 'task-monthly-4',
    title: 'Branch Duress Alarm & Emergency Equipment Inspection',
    description: 'Coordinate monthly silent duress button test with central alarm dispatch, inspect fire extinguishers and eyewash.',
    cadence: 'monthly',
    priority: 'standard',
    status: 'completed',
    category: 'Security & Facility',
    dueMonthDay: 5,
    deadlineTime: 'Day 5 of month',
    requiresDualControl: true,
    completedAt: 'Oct 05, 08:15 AM',
    completedBy: 'A. Gupta',
    verifiedBy: 'Regional Security Dispatch #41',
    checklist: [
      { id: 'sub-26', title: 'Notify central monitoring prior to test', completed: true },
      { id: 'sub-27', title: 'Test teller 1-4 foot pedals & vault bill-trap', completed: true },
      { id: 'sub-28', title: 'Log confirmation receipt from monitoring', completed: true }
    ],
    notes: 'All 6 duress zones received clean signals at dispatch.',
    createdAt: '2026-10-01T09:00:00Z'
  },

  // CRITICAL / ESCALATED WORKFLOWS
  {
    id: 'task-crit-1',
    title: 'Urgent Wire Transfer Recall / Suspected Fraud Flag',
    description: 'Outbound wire $45,000 flagged for business email compromise. Request Fedwire recall and notify correspondent bank.',
    cadence: 'critical',
    priority: 'critical',
    status: 'in_progress',
    category: 'Wire & Risk',
    deadlineTime: 'URGENT (Cutoff 14:00)',
    requiresDualControl: true,
    checklist: [
      { id: 'sub-29', title: 'Contact Fedwire operations desk for message reversal', completed: true },
      { id: 'sub-30', title: 'Freeze beneficiary debit account hold', completed: true },
      { id: 'sub-31', title: 'Collect customer affidavit and file SAR intake', completed: false }
    ],
    notes: 'Recall message sent ref #FW-98210. Awaiting receiving bank credit acknowledgment.',
    createdAt: '2026-10-23T11:15:00Z'
  },
  {
    id: 'task-crit-2',
    title: 'OFAC / Sanctions Screening Name-Match Remediation',
    description: 'New corporate account beneficial owner hit 89% fuzzy match against OFAC SDN list. Must verify passport and clear false positive.',
    cadence: 'critical',
    priority: 'critical',
    status: 'pending',
    category: 'AML & Compliance',
    deadlineTime: 'Before Account Activation',
    requiresDualControl: true,
    checklist: [
      { id: 'sub-32', title: 'Cross-reference DOB, citizenship, and passport number', completed: false },
      { id: 'sub-33', title: 'Document false positive disposition memorandum', completed: false },
      { id: 'sub-34', title: 'Escalate to Chief Compliance Officer for clearance', completed: false }
    ],
    createdAt: '2026-10-23T12:00:00Z'
  },

  // AD-HOC / WORK IN PROGRESS
  {
    id: 'task-adhoc-1',
    title: 'Commercial Loan Security Perfection & Title Search',
    description: 'Verify UCC-1 filing status and first mortgage deed registration for client Pinnacle Logistics LLC.',
    cadence: 'adhoc',
    priority: 'high',
    status: 'in_progress',
    category: 'Commercial Lending',
    deadlineTime: 'Friday Close',
    requiresDualControl: false,
    checklist: [
      { id: 'sub-35', title: 'Receive title insurance commitment letter', completed: true },
      { id: 'sub-36', title: 'Check county registry lien search', completed: false }
    ],
    createdAt: '2026-10-22T14:00:00Z'
  }
];

export const SYSTEM_IDEAS: AppIdea[] = [
  {
    id: 'idea-1',
    title: 'Idea 1: BranchCadence (The Dual-Cadence Operational Ledger)',
    subtitle: 'Split-Horizon Daily Routine & Monthly Compliance Runbook',
    archetype: 'Operational Rhythm Matrix',
    tagline: 'Built specifically for the rhythmic dual-cycle reality of bank branches.',
    focusArea: 'Separating daily opening/closing procedures from monthly audit cycles.',
    strengths: [
      'Automatic daily EOD checklist rollover with historical audit preservation',
      'Month-end calendar radar (Days 20-31 highlighted for GL & audit tie-outs)',
      'Dual-control (Maker/Checker) verification switches required for banking compliance',
      'One-click Printable Audit Pack export for internal examiners or branch managers'
    ],
    idealFor: 'Branch Operations Managers, Head Tellers, and General Branch Bankers managing daily balance + monthly regulatory tasks.',
    workflowOverview: 'Morning opening checklist → Mid-day AML/high-value checks → End-of-day teller cash balance → Monthly GL close radar.'
  },
  {
    id: 'idea-2',
    title: 'Idea 2: VaultDesk (Risk & Criticality-First Banker Action Station)',
    subtitle: 'Eisenhower Priority Matrix with Dual-Custody Audit Verification',
    archetype: 'Risk-Tiered Execution Console',
    tagline: 'Prevents critical compliance slips while handling high-volume branch requests.',
    focusArea: 'Prioritizing high-risk AML, fraud recalls, and dual-custody tasks above routine items.',
    strengths: [
      'Color-coded risk quadrants: Critical (Immediate/Regulatory), Daily Core, Monthly Cadence, and Ad-hoc',
      'Dual-signoff custodian approval stamps directly in the card',
      'Time-decay countdowns for critical clearing cutoffs (e.g. Fedwire 14:00, ACH 16:00)',
      'Zero-loss offline persistence directly in browser storage'
    ],
    idealFor: 'Vault Custodians, Compliance Officers, and Deputy Branch Managers who handle escalations and dual-custody keys.',
    workflowOverview: 'Active alerts at the top → Critical regulatory cutoffs → Routine operational tasks categorized by risk weight.'
  },
  {
    id: 'idea-3',
    title: 'Idea 3: Teller & Desk Runbook (Procedural Banking SOP Tracker)',
    subtitle: 'Interactive Standard Operating Procedure Steps with Timestamps',
    archetype: 'Standard Operating Procedure Engine',
    tagline: 'Transforms complex banking procedures into step-by-step verified sequences.',
    focusArea: 'Step-by-step verified execution of sensitive multi-step bank procedures.',
    strengths: [
      'Expandable micro-checklists for complex procedures (Vault balancing, loan disbursal, KYC false-positive checks)',
      'GL Account number cross-referencing right on each card for fast ledger posting',
      'Timestamped audit notes log for examiner-ready operational logs',
      'Custom branch procedure template presets (Cashier, Loan Officer, Branch Auditor)'
    ],
    idealFor: 'New or seasoned branch bankers needing strict standard operating procedure tracking with zero errors.',
    workflowOverview: 'Select banking SOP → Follow step-by-step verification checklist → Log dual signoff → Auto-archive to daily ledger.'
  },
  {
    id: 'idea-4',
    title: 'Idea 4: BranchFlow Matrix (Unified Recurring Workstream & Milestone Hub)',
    subtitle: 'Single-Pane-of-Glass Banking Workstream with Custom Quick-Filters',
    archetype: 'Unified Workstream Hub',
    tagline: 'Ultra-fast, keyboard-friendly task tracking with instant batch actions.',
    focusArea: 'High-speed logging, quick filtering, and instant status updates during busy lobby hours.',
    strengths: [
      'Instant hotkey filters for Daily, Monthly, Critical, and Overdue items',
      'Quick-add task drawer with pre-filled banking categories (Vault, Wire, AML, Loans, GL)',
      'Exportable daily balancing sheet in CSV or clean JSON backup',
      '100% standalone, no database setup, zero network dependency'
    ],
    idealFor: 'Universal Bankers and Customer Service Representatives juggling customer queues, phone inquiries, and operational backlogs.',
    workflowOverview: 'Fast scan during customer breaks → 1-click status transitions → Rapid notes capture → End-of-day summary export.'
  }
];

export const BANKING_CATEGORIES = [
  'All Categories',
  'Cash & Vault',
  'Clearing & Settlement',
  'AML & Compliance',
  'Finance & GL',
  'Accounts & KYC',
  'Security & Facility',
  'Wire & Risk',
  'Commercial Lending'
];
