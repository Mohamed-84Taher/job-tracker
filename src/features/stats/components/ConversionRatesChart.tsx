import React from "react";
import type { StatsSummary, FunnelStage } from "../types";

interface ConversionRatesChartProps {
  summary: StatsSummary;
  funnelStages: FunnelStage[];
}

export const ConversionRatesChart: React.FC<ConversionRatesChartProps> = ({
  summary,
  funnelStages,
}) => {
  // Conversion from interview to offer specifically
  const interviewToOfferRate =
    summary.interview + summary.offers > 0
      ? Math.round(
          (summary.offers / (summary.interview + summary.offers)) * 1000,
        ) / 10
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Response & Conversion Rates
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          How effectively your applications progress through the recruitment funnel
        </p>
      </div>

      {/* Funnel Progress Bars */}
      <div className="space-y-4">
        {funnelStages.map((stage, idx) => (
          <div key={stage.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 inline-flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                {stage.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {stage.count}
                </span>
                <span className="text-slate-400 font-medium">
                  ({stage.rate}%)
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(stage.rate, 3)}%`,
                  backgroundColor: stage.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* KPI highlight pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
        <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/60">
          <p className="text-[11px] font-medium text-indigo-600 uppercase tracking-wider">
            Response Rate
          </p>
          <p className="text-xl font-bold text-indigo-900 mt-1">
            {summary.responseRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Heard back from companies
          </p>
        </div>

        <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/60">
          <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">
            Interview Rate
          </p>
          <p className="text-xl font-bold text-amber-900 mt-1">
            {summary.interviewRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Invited to interview
          </p>
        </div>

        <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60">
          <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
            Interview → Offer
          </p>
          <p className="text-xl font-bold text-emerald-900 mt-1">
            {interviewToOfferRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Interviews closed as offers
          </p>
        </div>
      </div>
    </div>
  );
};
