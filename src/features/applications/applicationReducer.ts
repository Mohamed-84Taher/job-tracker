import type { Application } from './types';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
}

export const initialState: ApplicationsState = {
  applications: [],
  isLoading: true,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'LOAD'; payload: Application[] }
  | { type: 'ADD'; payload: Application }
  | { type: 'EDIT'; payload: Application }
  | { type: 'DELETE'; payload: string } // payload = id
  | { type: 'REORDER'; payload: Application[] };

export type ApplicationAction = Action;

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function applicationReducer(
  state: ApplicationsState,
  action: Action,
): ApplicationsState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        applications: action.payload,
        isLoading: false,
      };

    case 'ADD':
      return {
        ...state,
        applications: [...state.applications, action.payload],
      };

    case 'EDIT':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? action.payload : app,
        ),
      };

    case 'DELETE':
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload,
        ),
      };

    case 'REORDER':
      return {
        ...state,
        applications: action.payload,
      };

    default:
      return state;
  }
}
