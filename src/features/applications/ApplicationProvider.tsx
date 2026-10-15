import { useCallback, useEffect, useReducer, type ReactNode } from "react";
import { nanoid } from "nanoid";
import type { Application } from "./types";
import type { ApplicationFormData } from "./schema";
import { applicationReducer, initialState } from "./applicationReducer";
import { ApplicationsContext } from "./ApplicationContext";
import * as storage from "../../lib/storage";

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    storage.getAll().then((apps) => {
      dispatch({ type: "LOAD", payload: apps });
    });
  }, []);

  // ----- actions (persist to IndexedDB, then dispatch) ---------------------

  const addApplication = useCallback(async (data: ApplicationFormData) => {
    // Calculate the next order value for this status column
    const all = await storage.getAll();
    const sameStatus = all.filter((a) => a.status === data.status);
    const maxOrder =
      sameStatus.length > 0 ? Math.max(...sameStatus.map((a) => a.order)) : -1;

    const newApp: Application = {
      ...data,
      id: nanoid(),
      order: maxOrder + 1,
    };

    await storage.save(newApp);
    dispatch({ type: "ADD", payload: newApp });
  }, []);

  const editApplication = useCallback(async (app: Application) => {
    await storage.save(app);
    dispatch({ type: "EDIT", payload: app });
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    await storage.remove(id);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return (
    <ApplicationsContext.Provider
      value={{
        ...state,
        addApplication,
        editApplication,
        deleteApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}
