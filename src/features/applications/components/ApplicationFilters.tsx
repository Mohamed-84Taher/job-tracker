import React, { useState } from "react";
import type { FilterStatus, SortOption } from "../types";
import { STATUSES } from "../types";
import { Button } from "../../../components/Button";

interface ApplicationFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  statusCounts: Record<FilterStatus, number>;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  hasFollowUp: boolean;
  onHasFollowUpChange: (hasFollowUp: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilterCount: number;
  isFiltered: boolean;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  all: "All",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusCounts,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  hasFollowUp,
  onHasFollowUpChange,
  sortBy,
  onSortChange,
  activeFilterCount,
  isFiltered,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 mb-6 space-y-4">
      {/* Primary Toolbar: Search + Quick Status + Sort + Filter Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company or role…"
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            aria-label="Search applications by company or role"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Secondary Controls: Advanced Filters Toggle & Sort Select */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto w-full lg:w-auto justify-between lg:justify-start">
          {/* Advanced filters trigger (Date, Follow-up) */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showAdvanced || hasDateFilter || hasFollowUp
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            aria-expanded={showAdvanced}
          >
            <svg
              className="w-4 h-4 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <svg
              className="w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            <label htmlFor="sort-dropdown" className="sr-only">
              Sort applications by
            </label>
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-xs bg-transparent text-slate-700 font-medium border-none focus:outline-hidden cursor-pointer py-1 pr-2"
            >
              <option value="date-desc">Newest Applied</option>
              <option value="date-asc">Oldest Applied</option>
              <option value="company-asc">Company (A-Z)</option>
              <option value="company-desc">Company (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-400 mr-1.5 shrink-0 hidden sm:inline">
          Status:
        </span>
        <button
          type="button"
          onClick={() => onStatusChange("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            statusFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          All
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === "all"
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {statusCounts.all}
          </span>
        </button>

        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 capitalize shrink-0 ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            {STATUS_LABELS[status] || status}
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === status
                  ? "bg-indigo-700 text-indigo-100"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Advanced Filter Panel: Date Range + Follow-Up Toggle */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl animate-in fade-in duration-150">
          {/* Start Date */}
          <div>
            <label
              htmlFor="filter-start-date"
              className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
            >
              Applied From
            </label>
            <input
              id="filter-start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="filter-end-date"
              className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
            >
              Applied To
            </label>
            <input
              id="filter-end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Follow-up Reminder Toggle */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => onHasFollowUpChange(!hasFollowUp)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                hasFollowUp
                  ? "bg-amber-100 border-amber-300 text-amber-900 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${hasFollowUp ? "text-amber-700" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span>{hasFollowUp ? "✓ Has Follow-up" : "Has Follow-up"}</span>
            </button>
          </div>

          {/* Quick Clear for dates & reminder */}
          <div className="flex items-end">
            {(hasDateFilter || hasFollowUp) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onStartDateChange("");
                  onEndDateChange("");
                  onHasFollowUpChange(false);
                }}
                className="w-full text-xs text-slate-500 hover:text-slate-800"
              >
                Clear Range & Follow-up
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Pills Summary */}
      {isFiltered && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium">Active filters:</span>

            {searchInput.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                Query: "{searchInput.trim()}"
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-rose-600 cursor-pointer ml-0.5"
                  title="Remove query filter"
                >
                  ✕
                </button>
              </span>
            )}

            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium capitalize">
                Status: {statusFilter}
                <button
                  type="button"
                  onClick={() => onStatusChange("all")}
                  className="hover:text-rose-600 cursor-pointer ml-0.5"
                  title="Remove status filter"
                >
                  ✕
                </button>
              </span>
            )}

            {startDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                From: {startDate}
                <button
                  type="button"
                  onClick={() => onStartDateChange("")}
                  className="hover:text-rose-600 cursor-pointer ml-0.5"
                  title="Remove start date"
                >
                  ✕
                </button>
              </span>
            )}

            {endDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                To: {endDate}
                <button
                  type="button"
                  onClick={() => onEndDateChange("")}
                  className="hover:text-rose-600 cursor-pointer ml-0.5"
                  title="Remove end date"
                >
                  ✕
                </button>
              </span>
            )}

            {hasFollowUp && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                🔔 Has Follow-up
                <button
                  type="button"
                  onClick={() => onHasFollowUpChange(false)}
                  className="hover:text-rose-600 cursor-pointer ml-0.5"
                  title="Remove follow-up filter"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline ml-1"
            >
              Reset all
            </button>
          </div>

          <div className="text-slate-500 font-medium shrink-0">
            Showing <strong className="text-slate-800">{filteredCount}</strong>{" "}
            of <strong className="text-slate-800">{totalCount}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
