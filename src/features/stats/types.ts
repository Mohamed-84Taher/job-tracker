import type { Status } from "../applications/types";

export interface StatusMetric {
  status: Status;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StatsSummary {
  total: number;
  active: number;
  offers: number;
  rejected: number;
  interview: number;
  applied: number;
  responseRate: number; // % that have had a response (interview, offer, or rejected)
  interviewRate: number; // % of total applications that reached interview or offer stage
  offerRate: number; // % of total applications that resulted in an offer
  avgDaysToFirstResponse: number | null; // average days between appliedAt and first response / follow-up
}

export interface TimelineDataPoint {
  date: string; // e.g. "Oct 12"
  rawDate: string; // e.g. "2026-10-12"
  count: number;
  cumulative: number;
}

export interface FunnelStage {
  name: string;
  count: number;
  rate: number; // conversion percentage
  color: string;
}
