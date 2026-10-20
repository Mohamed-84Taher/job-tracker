import React from "react";
import { useDroppable } from "@dnd-kit/react";
import type { Application, Status } from "../types";
import { SortableApplicationCard } from "./SortableApplicationCard";

interface KanbanColumnProps {
  status: Status;
  title: string;
  applications: Application[];
  onAddNew: (status: Status) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus: (id: string, newStatus: Status) => void;
}

const COLUMN_THEMES: Record<
  Status,
  {
    dot: string;
    badgeBg: string;
    badgeText: string;
    borderActive: string;
    headerBg: string;
  }
> = {
  applied: {
    dot: "bg-blue-500",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700 border-blue-200",
    borderActive: "border-blue-400 bg-blue-50/20 ring-2 ring-blue-400/20",
    headerBg: "bg-blue-50/40",
  },
  interview: {
    dot: "bg-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700 border-amber-200",
    borderActive: "border-amber-400 bg-amber-50/20 ring-2 ring-amber-400/20",
    headerBg: "bg-amber-50/40",
  },
  offer: {
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700 border-emerald-200",
    borderActive:
      "border-emerald-400 bg-emerald-50/20 ring-2 ring-emerald-400/20",
    headerBg: "bg-emerald-50/40",
  },
  rejected: {
    dot: "bg-rose-500",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700 border-rose-200",
    borderActive: "border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/20",
    headerBg: "bg-rose-50/40",
  },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  applications,
  onAddNew,
  onEdit,
  onDelete,
  onMoveToStatus,
}) => {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    data: {
      status,
      type: "column",
    },
  });

  const theme = COLUMN_THEMES[status];

  return (
    <div
      ref={ref}
      aria-label={`${title} column, ${applications.length} applications`}
      className={`flex flex-col rounded-2xl border transition-all duration-200 min-w-[280px] flex-1 bg-slate-100/70 ${
        isDropTarget
          ? theme.borderActive
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      {/* Column Header */}
      <div
        className={`px-4 py-3.5 border-b border-slate-200/70 rounded-t-2xl flex items-center justify-between ${theme.headerBg}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            {title}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${theme.badgeBg} ${theme.badgeText}`}
          >
            {applications.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddNew(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          title={`Add application to ${title}`}
          aria-label={`Add application to ${title}`}
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
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Cards List / Droppable Area */}
      <div className="p-3 flex-1 flex flex-col gap-3 min-h-[350px]">
        {applications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl my-1 bg-white/40">
            <p className="text-xs font-medium text-slate-400">
              No applications here
            </p>
            <button
              type="button"
              onClick={() => onAddNew(status)}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
            >
              <span>+ Add a job</span>
            </button>
          </div>
        ) : (
          applications.map((app, index) => (
            <SortableApplicationCard
              key={app.id}
              application={app}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToStatus={onMoveToStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};
