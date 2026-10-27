import React, { useState, useMemo } from "react";
import {
  DragDropProvider,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { Application, Status } from "../types";
import { STATUSES } from "../types";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "../../../components/Button";

interface KanbanBoardProps {
  applications: Application[];
  totalCount?: number;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onAddNew: (status?: Status) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus: (id: string, newStatus: Status) => void;
  onReorder: (updatedApps: Application[]) => Promise<void>;
  onLoadSampleData?: () => void;
  onClearAll?: () => void;
}

const COLUMN_CONFIG: Array<{ status: Status; title: string }> = [
  { status: "applied", title: "Applied" },
  { status: "interview", title: "Interview" },
  { status: "offer", title: "Offer" },
  { status: "rejected", title: "Rejected" },
];

type ColumnItems = Record<Status, string[]>;

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  totalCount,
  isFiltered = false,
  onResetFilters,
  onAddNew,
  onEdit,
  onDelete,
  onMoveToStatus,
  onReorder,
  onLoadSampleData,
  onClearAll,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragItems, setDragItems] = useState<ColumnItems | null>(null);

  // Group application IDs by status, ordered by `order`
  const initialItems = useMemo((): ColumnItems => {
    const result: ColumnItems = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
    };
    const sorted = [...applications].sort((a, b) => a.order - b.order);
    for (const app of sorted) {
      if (result[app.status]) {
        result[app.status].push(app.id);
      }
    }
    return result;
  }, [applications]);

  // Current items: optimistic during drag, or derived from applications when idle
  const items = dragItems ?? initialItems;

  // Lookup map for fast application retrieval by ID
  const applicationsMap = useMemo(() => {
    return new Map(applications.map((app) => [app.id, app]));
  }, [applications]);

  // Active application currently being dragged
  const activeApplication = activeId ? applicationsMap.get(activeId) : null;

  // Build the list of applications for each column based on current `items`
  const columnApplications = useMemo(() => {
    const map: Record<Status, Application[]> = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
    };
    for (const status of STATUSES) {
      const ids = items[status] || [];
      for (const id of ids) {
        const app = applicationsMap.get(id);
        if (app) {
          map[status].push(app);
        }
      }
    }
    return map;
  }, [items, applicationsMap]);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.operation.source?.id;
    if (typeof id === "string") {
      setActiveId(id);
      setDragItems(initialItems);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    setDragItems((current) => move(current ?? initialItems, event));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);

    if (event.canceled) {
      setDragItems(null);
      return;
    }

    const currentItems = dragItems ?? initialItems;
    const finalItems = move(currentItems, event);
    setDragItems(null);

    // Reconcile and calculate new status and order for all applications
    const updatedApps: Application[] = [];

    for (const status of STATUSES) {
      const ids = finalItems[status] || [];
      ids.forEach((id, index) => {
        const app = applicationsMap.get(id);
        if (app) {
          if (app.status !== status || app.order !== index) {
            updatedApps.push({
              ...app,
              status,
              order: index,
            });
          }
        }
      });
    }

    if (updatedApps.length > 0) {
      const updatedMap = new Map(updatedApps.map((a) => [a.id, a]));
      const fullUpdatedList = applications.map(
        (app) => updatedMap.get(app.id) ?? app,
      );
      await onReorder(fullUpdatedList);
    }
  };

  // Empty state: either no applications match filters, or database is completely empty
  if (applications.length === 0) {
    if (isFiltered) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4 shadow-2xs">
            <svg
              className="w-7 h-7"
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            No applications match your filters
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            We couldn&apos;t find any job applications matching your active search,
            status, or date criteria.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onResetFilters && (
              <Button variant="primary" onClick={onResetFilters}>
                Reset All Filters
              </Button>
            )}
            <Button variant="outline" onClick={() => onAddNew()}>
              Add New Application
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4 shadow-2xs">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Your Kanban board is empty
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Track job opportunities across Applied, Interview, Offer, and Rejected
          stages. Drag and drop cards smoothly to advance your pipeline.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={() => onAddNew()}>
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
          {onLoadSampleData && (
            <Button variant="secondary" onClick={onLoadSampleData}>
              Load Sample Jobs
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Board Controls & Accessibility Hint Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            {applications.length}{" "}
            {applications.length === 1 ? "Application" : "Applications"}
            {isFiltered && totalCount !== undefined
              ? ` (filtered from ${totalCount})`
              : " Total"}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="hidden sm:inline text-slate-500">
            Drag cards across columns or use the &ldquo;Move to…&rdquo; menu.
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {onLoadSampleData && (
            <button
              type="button"
              onClick={onLoadSampleData}
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Load Sample Data
            </button>
          )}
          {onClearAll && (
            <>
              <span className="text-slate-300">&bull;</span>
              <button
                type="button"
                onClick={onClearAll}
                className="text-rose-600 hover:text-rose-800 font-medium hover:underline"
              >
                Clear Board
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drag and Drop Kanban Board */}
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start overflow-x-auto pb-4">
          {COLUMN_CONFIG.map(({ status, title }) => (
            <KanbanColumn
              key={status}
              status={status}
              title={title}
              applications={columnApplications[status]}
              onAddNew={onAddNew}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToStatus={onMoveToStatus}
            />
          ))}
        </div>

        {/* Drag Overlay for smooth preview while dragging */}
        <DragOverlay>
          {activeApplication ? (
            <ApplicationCard
              application={activeApplication}
              onEdit={() => {}}
              onDelete={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
};
