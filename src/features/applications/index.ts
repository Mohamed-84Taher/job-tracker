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
export { ApplicationsProvider } from "./ApplicationProvider";
export {
  ApplicationsContext,
  type ApplicationsContextValue,
} from "./ApplicationContext";
export { useApplications } from "./useApplications";

// Components
export { StatusBadge } from "./components/StatusBadge";
export { ApplicationCard } from "./components/ApplicationCard";
export { ApplicationForm } from "./components/ApplicationForm";
export { ApplicationList } from "./components/ApplicationList";
