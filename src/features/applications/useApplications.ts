import { useContext } from "react";
import {
  ApplicationsContext,
  type ApplicationsContextValue,
} from "./ApplicationContext";

/**
 * Hook to access the applications state and actions.
 * Must be used within an `<ApplicationsProvider>`.
 */
export function useApplications(): ApplicationsContextValue {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error(
      "useApplications must be used within an <ApplicationsProvider>",
    );
  }
  return ctx;
}
