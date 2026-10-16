import type { Application } from "../features/applications/types";

export const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: "sample-1",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    status: "interview",
    location: "Remote, US",
    salary: "$165,000 - $190,000",
    link: "https://stripe.com/jobs",
    notes:
      "Passed recruiter screen. Technical architecture interview scheduled for next Tuesday.",
    appliedAt: "2026-10-01T09:00:00.000Z",
    followUpAt: "2026-10-20T10:00:00.000Z",
    order: 0,
  },
  {
    id: "sample-2",
    company: "Linear",
    role: "Product Engineer",
    status: "applied",
    location: "San Francisco, CA / Remote",
    salary: "$170,000 - $200,000",
    link: "https://linear.app/careers",
    notes:
      "Submitted portfolio with React 19 + TypeScript projects and offline-first apps.",
    appliedAt: "2026-10-10T14:30:00.000Z",
    followUpAt: "2026-10-24T09:00:00.000Z",
    order: 0,
  },
  {
    id: "sample-3",
    company: "Vercel",
    role: "DX Engineer",
    status: "offer",
    location: "Remote",
    salary: "$180,000",
    link: "https://vercel.com/careers",
    notes:
      "Received written offer! 4 weeks PTO, comprehensive health coverage, and stock options.",
    appliedAt: "2026-09-15T11:00:00.000Z",
    order: 0,
  },
  {
    id: "sample-4",
    company: "GitHub",
    role: "Staff Software Engineer",
    status: "rejected",
    location: "Remote",
    salary: "$195,000",
    link: "https://github.com/about/careers",
    notes:
      "Position filled internally. Recruiter offered to keep profile active for upcoming team openings.",
    appliedAt: "2026-09-02T16:00:00.000Z",
    order: 0,
  },
];
