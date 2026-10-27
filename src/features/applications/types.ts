/**
 * Application status representing each Kanban column.
 */
export type Status = 'applied' | 'interview' | 'offer' | 'rejected';

/**
 * All possible statuses, in display order.
 * Useful for iterating over columns.
 */
export const STATUSES: readonly Status[] = [
  'applied',
  'interview',
  'offer',
  'rejected',
] as const;

/**
 * A single job application entry.
 */
export interface Application {
  /** Unique identifier (nanoid) */
  id: string;
  /** Company name */
  company: string;
  /** Job role / title */
  role: string;
  /** Current status in the pipeline */
  status: Status;
  /** Job location (e.g. "Remote", "London, UK") */
  location?: string;
  /** Salary or salary range */
  salary?: string;
  /** URL to the job posting */
  link?: string;
  /** Free-form notes */
  notes?: string;
  /** ISO date string of when the application was submitted */
  appliedAt: string;
  /** ISO date string for follow-up reminder */
  followUpAt?: string;
/**
 * Position inside the status column (for ordering)
 */
  order: number;
}

/**
 * Status filter option, including 'all' to show all applications.
 */
export type FilterStatus = 'all' | Status;

/**
 * Supported sorting options for applications.
 */
export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'company-asc'
  | 'company-desc';

/**
 * Filter and sort parameters.
 */
export interface ApplicationFilterState {
  search: string;
  status: FilterStatus;
  startDate: string;
  endDate: string;
  hasFollowUp: boolean;
  sortBy: SortOption;
}

