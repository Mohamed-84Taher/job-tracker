import { createContext } from "react";
import type { ApplicationsState } from "./applicationReducer";
import type { ApplicationFormData } from "./schema";
import type { Application, Status } from "./types";

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------
export interface ApplicationsContextValue extends ApplicationsState {
  addApplication: (data: ApplicationFormData) => Promise<void>;
  editApplication: (app: Application) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  reorderApplications: (updated: Application[]) => Promise<void>;
  moveApplication: (
    id: string,
    newStatus: Status,
    newOrder?: number
  ) => Promise<void>;
  loadSampleData: () => Promise<void>;
  clearAllApplications: () => Promise<void>;
}

export const ApplicationsContext =
  createContext<ApplicationsContextValue | null>(null);
