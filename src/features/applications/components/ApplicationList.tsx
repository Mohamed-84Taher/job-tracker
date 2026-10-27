import React, { useState } from "react";
import type { Application, Status } from "../types";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "../../../components/Button";

interface ApplicationListProps {
  applications: Application[];
  totalCount?: number;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onAddNew: () => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus?: (id: string, newStatus: Status) => void;
  onLoadSampleData: () => void;
  onClearAll: () => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  totalCount,
  isFiltered = false,
  onResetFilters,
  onAddNew,
  onEdit,
  onDelete,
  onMoveToStatus,
  onLoadSampleData,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 1. Empty state when there are NO applications at all in the database
  if (applications.length === 0 && !isFiltered) {
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
    <div className="space-y-4">
      {/* Directory Action Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="text-xs font-semibold text-slate-600">
          <span>
            {applications.length}{" "}
            {applications.length === 1 ? "Position" : "Positions"} Listed
          </span>
          {isFiltered && totalCount !== undefined && (
            <span className="text-slate-400 font-normal ml-1">
              (filtered from {totalCount})
            </span>
          )}
        </div>

        {/* Load Sample / Clear buttons */}
        <div className="flex items-center gap-2">
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

      {/* 2. Empty state for when active filter returns 0 results */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center my-6">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-slate-800 mb-1">
            No matching applications found
          </h4>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, clearing status, or resetting your
            date range filters.
          </p>
          {onResetFilters && (
            <Button size="sm" variant="outline" onClick={onResetFilters}>
              Reset all filters
            </Button>
          )}
        </div>
      ) : (
        /* Applications Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
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
