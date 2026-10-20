import React, { useState, useMemo } from "react";
import type { Application, Status } from "../types";
import { STATUSES } from "../types";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "../../../components/Button";

interface ApplicationListProps {
  applications: Application[];
  onAddNew: () => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus?: (id: string, newStatus: Status) => void;
  onLoadSampleData: () => void;
  onClearAll: () => void;
}

type FilterStatus = "all" | Status;
type SortOption = "date-desc" | "date-asc" | "company-asc";

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onAddNew,
  onEdit,
  onDelete,
  onMoveToStatus,
  onLoadSampleData,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Status counts
  const counts = useMemo(() => {
    const summary: Record<FilterStatus, number> = {
      all: applications.length,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const app of applications) {
      if (summary[app.status] !== undefined) {
        summary[app.status]++;
      }
    }
    return summary;
  }, [applications]);

  // Filtered & sorted applications
  const displayedApplications = useMemo(() => {
    let result = [...applications];

    if (filter !== "all") {
      result = result.filter((app) => app.status === filter);
    }

    result.sort((a, b) => {
      if (sortOption === "company-asc") {
        return a.company.localeCompare(b.company);
      }
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      if (sortOption === "date-asc") {
        return dateA - dateB;
      }
      // default: date-desc
      return dateB - dateA;
    });

    return result;
  }, [applications, filter, sortOption]);

  // 1. Empty state when there are NO applications at all
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No job applications yet
        </h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          Start organizing your career pipeline. Track interviews, job offers,
          salaries, and follow-up deadlines all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
            Add Your First Application
          </Button>
          <Button variant="outline" onClick={onLoadSampleData}>
            Load Sample Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls & Filter toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              filter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                filter === "all"
                  ? "bg-slate-800 text-slate-200"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {counts.all}
            </span>
          </button>

          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 capitalize shrink-0 ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                  filter === status
                    ? "bg-indigo-700 text-indigo-100"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {counts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Sort & Secondary Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-xs font-medium text-slate-500 shrink-0"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="date-desc">Newest Applied</option>
              <option value="date-asc">Oldest Applied</option>
              <option value="company-asc">Company (A-Z)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Load Sample / Clear buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={onLoadSampleData}
              title="Add sample applications"
            >
              + Samples
            </Button>
            {showClearConfirm ? (
              <div className="flex items-center gap-1 animate-in fade-in">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                >
                  Clear DB
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowClearConfirm(false)}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowClearConfirm(true)}
                title="Clear all stored applications"
                className="text-slate-400 hover:text-rose-600"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Empty state for when filter returns 0 results */}
      {displayedApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center my-6">
          <p className="text-slate-600 text-sm mb-3">
            No applications found matching the <strong>{filter}</strong> status.
          </p>
          <Button size="sm" variant="outline" onClick={() => setFilter("all")}>
            Show all applications
          </Button>
        </div>
      ) : (
        /* Applications Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToStatus={onMoveToStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
