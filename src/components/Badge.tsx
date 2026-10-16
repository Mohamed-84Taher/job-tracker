import React, { type HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "purple"
  | "slate";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-2.5 py-1 text-xs font-semibold",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
