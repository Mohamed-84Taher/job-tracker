import React from "react";
import type { Status } from "../types";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

const statusConfig: Record<
  Status,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
  interview: {
    label: "Interview",
    bg: "bg-amber-50",
    text: "text-amber-800",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  offer: {
    label: "Offer",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const config = statusConfig[status] ?? statusConfig.applied;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${
        isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span
        className={`rounded-full shrink-0 ${config.dot} ${
          isSm ? "w-1.5 h-1.5" : "w-2 h-2"
        }`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
};
