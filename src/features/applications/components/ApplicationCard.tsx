import React, { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { Application, Status } from "../types";
import { STATUSES } from "../types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "../../../components/Button";

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onMoveToStatus?: (id: string, newStatus: Status) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  dragHandleRef?: (element: HTMLDivElement | null) => void;
}

const STATUS_LABELS: Record<Status, string> = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const STATUS_DOT_COLORS: Record<Status, string> = {
  applied: "bg-blue-500",
  interview: "bg-amber-500",
  offer: "bg-emerald-500",
  rejected: "bg-rose-500",
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onMoveToStatus,
  isDragging = false,
  isOverlay = false,
  dragHandleRef,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  // Close move menu on outside click
  useEffect(() => {
    if (!showMoveMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        moveMenuRef.current &&
        !moveMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoveMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showMoveMenu]);

  // Format applied date safely
  const formattedAppliedDate = React.useMemo(() => {
    try {
      const date = parseISO(application.appliedAt);
      return format(date, "MMM d, yyyy");
    } catch {
      return application.appliedAt;
    }
  }, [application.appliedAt]);

  // Format follow-up date if present
  const formattedFollowUpDate = React.useMemo(() => {
    if (!application.followUpAt) return null;
    try {
      const date = parseISO(application.followUpAt);
      return format(date, "MMM d, yyyy");
    } catch {
      return application.followUpAt;
    }
  }, [application.followUpAt]);

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(application.id);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const otherStatuses = STATUSES.filter((s) => s !== application.status);

  return (
    <div
      role="article"
      aria-label={`${application.role} at ${application.company}, status: ${STATUS_LABELS[application.status]}`}
      className={`bg-white rounded-xl border transition-all duration-150 flex flex-col justify-between select-none ${
        isOverlay
          ? "border-indigo-400 shadow-2xl rotate-1 scale-[1.02] ring-2 ring-indigo-500/20 cursor-grabbing p-4"
          : isDragging
            ? "opacity-35 border-dashed border-2 border-slate-400 bg-slate-50/50 shadow-none p-4"
            : "border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-slate-300"
      }`}
    >
      <div>
        {/* Top bar: Drag Handle, Company & Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            {/* Accessible Drag Handle */}
            {!isOverlay && dragHandleRef && (
              <div
                ref={dragHandleRef}
                tabIndex={0}
                role="button"
                aria-label={`Drag to reorder ${application.company}`}
                className="mt-0.5 p-1 -ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0 touch-none"
                title="Drag to reorder or move column"
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
                    d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"
                  />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-slate-900 truncate">
                {application.company}
              </h4>
              <p className="text-sm font-medium text-slate-600 truncate mt-0.5">
                {application.role}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={application.status} size="sm" />
          </div>
        </div>

        {/* Metadata pills (Location, Salary, Date) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500">
          {/* Applied Date */}
          <div className="inline-flex items-center gap-1.5" title="Date Applied">
            <svg
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedAppliedDate}</span>
          </div>

          {/* Location */}
          {application.location && (
            <div className="inline-flex items-center gap-1.5" title="Location">
              <svg
                className="w-3.5 h-3.5 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate max-w-[130px]">
                {application.location}
              </span>
            </div>
          )}

          {/* Salary */}
          {application.salary && (
            <div
              className="inline-flex items-center gap-1.5"
              title="Salary / Compensation"
            >
              <svg
                className="w-3.5 h-3.5 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="truncate max-w-[130px] font-medium text-slate-700">
                {application.salary}
              </span>
            </div>
          )}

          {/* Job Link */}
          {application.link && !isOverlay && (
            <a
              href={application.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium hover:underline"
              title="Open job posting"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Link</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Follow-up date reminder banner */}
        {formattedFollowUpDate && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
            <svg
              className="w-3.5 h-3.5 text-amber-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Follow-up: {formattedFollowUpDate}</span>
          </div>
        )}

        {/* Notes preview */}
        {application.notes && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {application.notes}
          </p>
        )}
      </div>

      {/* Action Footer (hidden on drag overlay for cleaner visual) */}
      {!isOverlay && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {showConfirmDelete ? (
            <div className="flex items-center gap-2 w-full justify-end animate-in fade-in">
              <span className="text-xs text-rose-600 font-medium mr-auto">
                Delete?
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleDelete}>
                Confirm
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile Fallback: Move to… Menu */}
              <div className="relative" ref={moveMenuRef}>
                {onMoveToStatus && otherStatuses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowMoveMenu(!showMoveMenu)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                    title="Move application to another status"
                  >
                    <span>Move to…</span>
                    <svg
                      className="w-3 h-3 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Move Dropdown Menu */}
                {showMoveMenu && (
                  <div className="absolute left-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Move to column
                    </div>
                    {otherStatuses.map((targetStatus) => (
                      <button
                        key={targetStatus}
                        type="button"
                        onClick={() => {
                          onMoveToStatus?.(application.id, targetStatus);
                          setShowMoveMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[targetStatus]}`}
                        />
                        <span>{STATUS_LABELS[targetStatus]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(application)}
                >
                  <svg
                    className="w-3.5 h-3.5 mr-1 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={handleDelete}
                >
                  <svg
                    className="w-3.5 h-3.5 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
