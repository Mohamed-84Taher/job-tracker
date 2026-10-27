import React, { useMemo } from "react";
import { Link } from "react-router";
import type { Application } from "../../applications/types";
import { Button } from "../../../components/Button";
import {
  calculateStatsSummary,
  calculateStatusMetrics,
  calculateTimelineData,
  calculateFunnelStages,
} from "../utils/calculateStats";
import { StatsSummaryCards } from "./StatsSummaryCards";
import { ApplicationsTimelineChart } from "./ApplicationsTimelineChart";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { ConversionRatesChart } from "./ConversionRatesChart";

interface StatsDashboardProps {
  applications: Application[];
  onAddNew: () => void;
  onLoadSampleData: () => Promise<void>;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  applications,
  onAddNew,
  onLoadSampleData,
}) => {
  const summary = useMemo(
    () => calculateStatsSummary(applications),
    [applications],
  );

  const statusMetrics = useMemo(
    () => calculateStatusMetrics(applications),
    [applications],
  );

  const timelineData = useMemo(
    () => calculateTimelineData(applications),
    [applications],
  );

  const funnelStages = useMemo(
    () => calculateFunnelStages(applications),
    [applications],
  );

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          No Application Analytics Yet
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Start tracking positions to see velocity graphs, stage distribution,
          response rates, and response time metrics.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Button variant="primary" onClick={onAddNew}>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add First Application
          </Button>
          <Button variant="secondary" onClick={onLoadSampleData}>
            Load Demo Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Application Analytics & Metrics
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {summary.total} Tracked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pipeline performance, response benchmarks, and conversion funnel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all"
          >
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Pipeline</span>
          </Link>

          <Button variant="primary" onClick={onAddNew}>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Position</span>
          </Button>
        </div>
      </div>

      {/* 1. Summary KPI Cards */}
      <StatsSummaryCards summary={summary} />

      {/* 2. Charts Row: Timeline & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationsTimelineChart data={timelineData} />
        </div>
        <div>
          <StatusDistributionChart
            metrics={statusMetrics}
            total={summary.total}
          />
        </div>
      </div>

      {/* 3. Funnel & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConversionRatesChart
            summary={summary}
            funnelStages={funnelStages}
          />
        </div>

        {/* Search Insights / Health Score Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Search Insights
              </h3>
              <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Observations to optimize your job application conversion rate:
            </p>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-indigo-600 font-bold mt-0.5">&bull;</span>
                <div>
                  <span className="font-semibold text-slate-800">
                    Interview Momentum:
                  </span>{" "}
                  {summary.interviewRate >= 20 ? (
                    <span className="text-emerald-700">
                      Strong {summary.interviewRate}% interview rate above industry average (~10-15%).
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      Currently {summary.interviewRate}%. Tailoring resumes to job descriptions can boost this rate.
                    </span>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-amber-600 font-bold mt-0.5">&bull;</span>
                <div>
                  <span className="font-semibold text-slate-800">
                    Active Pipeline:
                  </span>{" "}
                  <span className="text-slate-600">
                    You have {summary.active} positions waiting for updates or interviews.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                <div>
                  <span className="font-semibold text-slate-800">
                    Response Benchmark:
                  </span>{" "}
                  <span className="text-slate-600">
                    {summary.avgDaysToFirstResponse !== null
                      ? `Average response turnaround is ${summary.avgDaysToFirstResponse} days.`
                      : "Add follow-up dates to measure response intervals."}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total pipeline records:</span>
            <span className="font-bold text-slate-700">{summary.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
