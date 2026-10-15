// Barrel export for the applications feature

// Types
export type { Application, Status } from "./types";
export { STATUSES } from "./types";

// Schemas
export {
  statusSchema,
  applicationSchema,
  applicationsArraySchema,
  applicationFormSchema,
  isValidApplication,
} from "./schema";
export type { ApplicationFormData } from "./schema";

// Reducer
export { applicationReducer, initialState } from "./applicationReducer";
export type {
  ApplicationsState,
  ApplicationAction,
} from "./applicationReducer";

// Context + Hook
export {
  ApplicationsProvider,
  ApplicationsContext,
} from "./ApplicationProvider";
export type { ApplicationsContextValue } from "./ApplicationProvider";
export { useApplications } from "./useApplications";
