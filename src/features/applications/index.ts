// Barrel export for the applications feature

// Types
export type {
  Application,
  Status,
  FilterStatus,
  SortOption,
  ApplicationFilterState,
} from "./types";
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
export { useApplicationFilters } from "./useApplicationFilters";

// Components
export { StatusBadge } from "./components/StatusBadge";
export { ApplicationCard } from "./components/ApplicationCard";
export { ApplicationForm } from "./components/ApplicationForm";
export { ApplicationList } from "./components/ApplicationList";
export { ApplicationFilters } from "./components/ApplicationFilters";
export { KanbanBoard } from "./components/KanbanBoard";
export { KanbanColumn } from "./components/KanbanColumn";
export { SortableApplicationCard } from "./components/SortableApplicationCard";
