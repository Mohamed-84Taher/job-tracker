import { format, parseISO, differenceInDays, isValid } from "date-fns";
import type { Application, Status } from "../../applications/types";
import type {
  StatsSummary,
  StatusMetric,
  TimelineDataPoint,
  FunnelStage,
} from "../types";

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  applied: {
    label: "Applied",
    color: "#6366F1", // Indigo-500
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-700",
  },
  interview: {
    label: "Interview",
    color: "#F59E0B", // Amber-500
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
  },
  offer: {
    label: "Offer",
    color: "#10B981", // Emerald-500
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
  },
  rejected: {
    label: "Rejected",
    color: "#F43F5E", // Rose-500
    bgClass: "bg-rose-50",
    textClass: "text-rose-700",
  },
};

/**
 * Computes high-level KPIs and conversion rates across all applications.
 */
export function calculateStatsSummary(
  applications: Application[],
): StatsSummary {
  const total = applications.length;

  if (total === 0) {
    return {
      total: 0,
      active: 0,
      offers: 0,
      rejected: 0,
      interview: 0,
      applied: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
      avgDaysToFirstResponse: null,
    };
  }

  let appliedCount = 0;
  let interviewCount = 0;
  let offerCount = 0;
  let rejectedCount = 0;

  const responseDurations: number[] = [];

  for (const app of applications) {
    switch (app.status) {
      case "applied":
        appliedCount++;
        break;
      case "interview":
        interviewCount++;
        break;
      case "offer":
        offerCount++;
        break;
      case "rejected":
        rejectedCount++;
        break;
    }

    // Measure time to response for applications that moved beyond "applied"
    if (app.status !== "applied") {
      const appliedDate = parseISO(app.appliedAt);
      if (isValid(appliedDate)) {
        if (app.followUpAt) {
          const followUpDate = parseISO(app.followUpAt);
          if (isValid(followUpDate)) {
            const diff = Math.abs(differenceInDays(followUpDate, appliedDate));
            responseDurations.push(diff > 0 ? diff : 1);
            continue;
          }
        }
        // Fallback: elapsed days since submission
        const diffFromNow = Math.max(
          1,
          differenceInDays(new Date(), appliedDate),
        );
        responseDurations.push(diffFromNow);
      }
    }
  }

  const respondedCount = interviewCount + offerCount + rejectedCount;
  const activeCount = appliedCount + interviewCount;

  const responseRate =
    total > 0 ? Math.round((respondedCount / total) * 1000) / 10 : 0;
  const interviewRate =
    total > 0
      ? Math.round(((interviewCount + offerCount) / total) * 1000) / 10
      : 0;
  const offerRate =
    total > 0 ? Math.round((offerCount / total) * 1000) / 10 : 0;

  const avgDaysToFirstResponse =
    responseDurations.length > 0
      ? Math.round(
          (responseDurations.reduce((acc, d) => acc + d, 0) /
            responseDurations.length) *
            10,
        ) / 10
      : null;

  return {
    total,
    active: activeCount,
    offers: offerCount,
    rejected: rejectedCount,
    interview: interviewCount,
    applied: appliedCount,
    responseRate,
    interviewRate,
    offerRate,
    avgDaysToFirstResponse,
  };
}

/**
 * Calculates counts and percentages for each application status.
 */
export function calculateStatusMetrics(
  applications: Application[],
): StatusMetric[] {
  const total = applications.length;
  const counts: Record<Status, number> = {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  for (const app of applications) {
    if (app.status in counts) {
      counts[app.status]++;
    }
  }

  const order: Status[] = ["applied", "interview", "offer", "rejected"];

  return order.map((status) => {
    const count = counts[status];
    const percentage =
      total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    return {
      status,
      label: STATUS_CONFIG[status].label,
      count,
      percentage,
      color: STATUS_CONFIG[status].color,
    };
  });
}

/**
 * Groups applications chronologically to produce a cumulative and per-day timeline.
 */
export function calculateTimelineData(
  applications: Application[],
): TimelineDataPoint[] {
  if (applications.length === 0) {
    return [];
  }

  // Filter and sort by appliedAt ascending
  const validApps = applications
    .map((app) => ({
      ...app,
      parsedDate: parseISO(app.appliedAt),
    }))
    .filter((app) => isValid(app.parsedDate))
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  if (validApps.length === 0) {
    return [];
  }

  // Group by "yyyy-MM-dd"
  const dateMap = new Map<string, number>();

  for (const app of validApps) {
    const key = format(app.parsedDate, "yyyy-MM-dd");
    dateMap.set(key, (dateMap.get(key) || 0) + 1);
  }

  const timeline: TimelineDataPoint[] = [];
  let runningCumulative = 0;

  for (const [rawDate, count] of dateMap.entries()) {
    runningCumulative += count;
    const parsed = parseISO(rawDate);
    const displayDate = isValid(parsed) ? format(parsed, "MMM d") : rawDate;

    timeline.push({
      date: displayDate,
      rawDate,
      count,
      cumulative: runningCumulative,
    });
  }

  return timeline;
}

/**
 * Funnel conversion stages: Total Applications -> Screen / Response -> Interview -> Offer.
 */
export function calculateFunnelStages(
  applications: Application[],
): FunnelStage[] {
  const total = applications.length;
  if (total === 0) return [];

  const responded = applications.filter(
    (a) => a.status !== "applied",
  ).length;
  const interviewed = applications.filter(
    (a) => a.status === "interview" || a.status === "offer",
  ).length;
  const offers = applications.filter((a) => a.status === "offer").length;

  return [
    {
      name: "Total Applied",
      count: total,
      rate: 100,
      color: "#6366F1", // Indigo
    },
    {
      name: "Got Response",
      count: responded,
      rate: total > 0 ? Math.round((responded / total) * 1000) / 10 : 0,
      color: "#3B82F6", // Blue
    },
    {
      name: "Interview Stage",
      count: interviewed,
      rate: total > 0 ? Math.round((interviewed / total) * 1000) / 10 : 0,
      color: "#F59E0B", // Amber
    },
    {
      name: "Job Offers",
      count: offers,
      rate: total > 0 ? Math.round((offers / total) * 1000) / 10 : 0,
      color: "#10B981", // Emerald
    },
  ];
}
