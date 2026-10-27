import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Application, FilterStatus, SortOption } from "./types";
import { STATUSES } from "./types";

const VALID_STATUSES = new Set<string>(["all", ...STATUSES]);
const VALID_SORT_OPTIONS = new Set<string>([
  "date-desc",
  "date-asc",
  "company-asc",
  "company-desc",
]);

interface UseApplicationFiltersOptions {
  debounceMs?: number;
}

export function useApplicationFilters(
  applications: Application[],
  options: UseApplicationFiltersOptions = {},
) {
  const { debounceMs = 300 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Derive filter & sort values directly from searchParams (single source of truth)
  const urlQ = searchParams.get("q") ?? "";

  const statusParam = searchParams.get("status");
  const statusFilter: FilterStatus =
    statusParam && VALID_STATUSES.has(statusParam)
      ? (statusParam as FilterStatus)
      : "all";

  const startDate = searchParams.get("from") ?? "";
  const endDate = searchParams.get("to") ?? "";
  const hasFollowUp = searchParams.get("followUp") === "true";

  const sortParam = searchParams.get("sort");
  const sortBy: SortOption =
    sortParam && VALID_SORT_OPTIONS.has(sortParam)
      ? (sortParam as SortOption)
      : "date-desc";

  const viewParam = searchParams.get("view");
  const viewMode: "board" | "list" = viewParam === "list" ? "list" : "board";

  // 2. Local state for immediate typing (no lag in input field)
  const [searchInput, setSearchInput] = useState<string>(urlQ);
  const [prevUrlQ, setPrevUrlQ] = useState<string>(urlQ);

  // Sync search input if external navigation (back/forward) changed ?q=
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setSearchInput(urlQ);
  }

  // 3. Debounce typing to update URL param ?q=
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParam = searchParams.get("q") ?? "";
      const trimmed = searchInput.trim();

      if (trimmed !== currentParam) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (trimmed) {
              next.set("q", trimmed);
            } else {
              next.delete("q");
            }
            return next;
          },
          { replace: true },
        );
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, debounceMs, searchParams, setSearchParams]);

  // 4. Setters that update URL parameters with { replace: true }
  const setStatusFilter = useCallback(
    (newStatus: FilterStatus) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newStatus === "all") {
            next.delete("status");
          } else {
            next.set("status", newStatus);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setStartDate = useCallback(
    (date: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (date) {
            next.set("from", date);
          } else {
            next.delete("from");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setEndDate = useCallback(
    (date: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (date) {
            next.set("to", date);
          } else {
            next.delete("to");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setHasFollowUp = useCallback(
    (followUp: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (followUp) {
            next.set("followUp", "true");
          } else {
            next.delete("followUp");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSortBy = useCallback(
    (sort: SortOption) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (sort === "date-desc") {
            next.delete("sort");
          } else {
            next.set("sort", sort);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setViewMode = useCallback(
    (mode: "board" | "list") => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (mode === "board") {
            next.delete("view");
          } else {
            next.set("view", mode);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // 5. Reset all filters to default
  const resetFilters = useCallback(() => {
    setSearchInput("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        // Preserve current view mode (board or list)
        const currentView = prev.get("view");
        if (currentView) {
          next.set("view", currentView);
        }
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  // 6. Filter and sort applications
  const debouncedSearch = urlQ;

  const filteredApplications = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const result = applications.filter((app) => {
      // Search filter: company or role
      if (query) {
        const companyMatch = app.company.toLowerCase().includes(query);
        const roleMatch = app.role.toLowerCase().includes(query);
        if (!companyMatch && !roleMatch) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      // Date range filter
      const appDate = app.appliedAt.slice(0, 10);
      if (startDate && appDate < startDate) {
        return false;
      }
      if (endDate && appDate > endDate) {
        return false;
      }

      // Follow-up reminder filter
      if (hasFollowUp) {
        if (!app.followUpAt || app.followUpAt.trim() === "") {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "company-asc") {
        return a.company.localeCompare(b.company, undefined, {
          sensitivity: "base",
        });
      }
      if (sortBy === "company-desc") {
        return b.company.localeCompare(a.company, undefined, {
          sensitivity: "base",
        });
      }

      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();

      if (sortBy === "date-asc") {
        return dateA - dateB;
      }

      // Default: 'date-desc' (newest first)
      return dateB - dateA;
    });

    return result;
  }, [
    applications,
    debouncedSearch,
    statusFilter,
    startDate,
    endDate,
    hasFollowUp,
    sortBy,
  ]);

  // 7. Status counts based on current search & secondary filters
  const statusCounts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const counts: Record<FilterStatus, number> = {
      all: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    for (const app of applications) {
      if (query) {
        const companyMatch = app.company.toLowerCase().includes(query);
        const roleMatch = app.role.toLowerCase().includes(query);
        if (!companyMatch && !roleMatch) continue;
      }

      const appDate = app.appliedAt.slice(0, 10);
      if (startDate && appDate < startDate) continue;
      if (endDate && appDate > endDate) continue;

      if (hasFollowUp && (!app.followUpAt || app.followUpAt.trim() === "")) {
        continue;
      }

      counts.all++;
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    }

    return counts;
  }, [applications, debouncedSearch, startDate, endDate, hasFollowUp]);

  // 8. Active filter count (excluding default sort & 'all' status)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch.trim() !== "") count++;
    if (statusFilter !== "all") count++;
    if (startDate !== "") count++;
    if (endDate !== "") count++;
    if (hasFollowUp) count++;
    return count;
  }, [debouncedSearch, statusFilter, startDate, endDate, hasFollowUp]);

  const isFiltered = activeFilterCount > 0;

  return {
    // Inputs & Setters
    searchInput,
    setSearchInput,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    hasFollowUp,
    setHasFollowUp,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,

    // Actions
    resetFilters,

    // Computed
    filteredApplications,
    statusCounts,
    activeFilterCount,
    isFiltered,
    totalCount: applications.length,
    filteredCount: filteredApplications.length,
  };
}
