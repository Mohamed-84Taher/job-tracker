import React, { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { StatusMetric } from "../types";

interface StatusDistributionChartProps {
  metrics: StatusMetric[];
  total: number;
}

export const StatusDistributionChart: React.FC<
  StatusDistributionChartProps
> = ({ metrics, total }) => {
  const [chartType, setChartType] = useState<"donut" | "bar">("donut");

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">No status data yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Stage breakdowns will show here once applications are added.
        </p>
      </div>
    );
  }

  // Filter out statuses with 0 count for clean donut rendering, but keep all in list
  const activePieData = metrics.filter((m) => m.count > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Status Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution across the four application stages
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setChartType("donut")}
            className={`px-3 py-1 rounded-md transition-all ${
              chartType === "donut"
                ? "bg-white text-indigo-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Donut
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md transition-all ${
              chartType === "bar"
                ? "bg-white text-indigo-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="w-full h-56 sm:h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "donut" ? (
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as StatusMetric;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-xs space-y-1 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <p className="text-slate-300">
                          {item.count} applications ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={activePieData}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {activePieData.map((entry) => (
                  <Cell key={`cell-${entry.status}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart
              data={metrics}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                horizontal={false}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tick={{ fill: "#64748B", fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as StatusMetric;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-xs border border-slate-800">
                        <span className="font-semibold">{item.label}:</span>{" "}
                        {item.count} ({item.percentage}%)
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {metrics.map((entry) => (
                  <Cell key={`bar-${entry.status}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend / Metrics summary list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 mt-auto">
        {metrics.map((item) => (
          <div
            key={item.status}
            className="flex flex-col p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-lg font-bold text-slate-900">
                {item.count}
              </span>
              <span className="text-[11px] text-slate-400">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
