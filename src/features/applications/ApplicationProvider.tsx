import { useCallback, useEffect, useReducer, type ReactNode } from "react";
import { nanoid } from "nanoid";
import type { Application, Status } from "./types";
import type { ApplicationFormData } from "./schema";
import { applicationReducer, initialState } from "./applicationReducer";
import { ApplicationsContext } from "./ApplicationContext";
import * as storage from "../../lib/storage";
import { SAMPLE_APPLICATIONS } from "../../lib/sampleData";

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

  const reorderApplications = useCallback(
    async (updated: Application[]) => {
      await storage.saveAll(updated);
      dispatch({ type: "REORDER", payload: updated });
    },
    [],
  );

  const moveApplication = useCallback(
    async (id: string, newStatus: Status, newOrder?: number) => {
      const all = await storage.getAll();
      const targetApp = all.find((a) => a.id === id);
      if (!targetApp) return;

      const sameStatus = all.filter(
        (a) => a.status === newStatus && a.id !== id,
      );
      const computedOrder =
        newOrder !== undefined
          ? newOrder
          : sameStatus.length > 0
            ? Math.max(...sameStatus.map((a) => a.order)) + 1
            : 0;

      const updatedApp: Application = {
        ...targetApp,
        status: newStatus,
        order: computedOrder,
      };

      await storage.save(updatedApp);
      const updatedAll = all.map((a) => (a.id === id ? updatedApp : a));
      dispatch({ type: "REORDER", payload: updatedAll });
    },
    [],
  );

  const loadSampleData = useCallback(async () => {
    await storage.saveAll(SAMPLE_APPLICATIONS);
    const all = await storage.getAll();
    dispatch({ type: "LOAD", payload: all });
  }, []);

  const clearAllApplications = useCallback(async () => {
    await storage.clear();
    dispatch({ type: "LOAD", payload: [] });
  }, []);

  return (
    <ApplicationsContext.Provider
      value={{
        ...state,
        addApplication,
        editApplication,
        deleteApplication,
        reorderApplications,
        moveApplication,
        loadSampleData,
        clearAllApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}
