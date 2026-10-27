import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { TimelineDataPoint } from "../types";

interface ApplicationsTimelineChartProps {
  data: TimelineDataPoint[];
}

export const ApplicationsTimelineChart: React.FC<
  ApplicationsTimelineChartProps
> = ({ data }) => {
  const [metric, setMetric] = useState<"cumulative" | "count">("cumulative");

  if (data.length === 0) {
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">
          No timeline data yet
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Applications will plot automatically across time as you submit them.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Applications Over Time
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Velocity and application cadence over your job search journey
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setMetric("cumulative")}
            className={`px-3 py-1 rounded-md transition-all ${
              metric === "cumulative"
                ? "bg-white text-indigo-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Cumulative Total
          </button>
          <button
            type="button"
            onClick={() => setMetric("count")}
            className={`px-3 py-1 rounded-md transition-all ${
              metric === "count"
                ? "bg-white text-indigo-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily Volume
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F5F9"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dx={-4}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as TimelineDataPoint;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-xs space-y-1 border border-slate-800">
                      <p className="font-semibold text-slate-200">
                        {item.date} ({item.rawDate})
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Applications:</span>
                        <span className="font-bold text-white">
                          {item.count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Total to date:</span>
                        <span className="font-bold text-indigo-300">
                          {item.cumulative}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
            />
            {metric === "cumulative" ? (
              <Line
                name="Cumulative Applications"
                type="monotone"
                dataKey="cumulative"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", r: 4, strokeWidth: 2, stroke: "#FFF" }}
                activeDot={{ r: 6, fill: "#4F46E5" }}
              />
            ) : (
              <Line
                name="New Applications / Day"
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ fill: "#3B82F6", r: 4, strokeWidth: 2, stroke: "#FFF" }}
                activeDot={{ r: 6, fill: "#2563EB" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
