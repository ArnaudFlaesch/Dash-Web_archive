import { TOGGLE_TAB, TOGGLE_REFRESH_WIDGETS, HANDLE_ERROR } from './actionTypes';

export interface IErrorToHandle {
  error: Error;
  customErrorMessage: string;
}

export const toggleSelectedTab = (id: number): { type: string; payload: { id: number } } => ({
  type: TOGGLE_TAB,
  payload: {
    id
  }
});

export const toggleRefreshWidgets = (): { type: string; payload: Record<string, never> } => ({
  type: TOGGLE_REFRESH_WIDGETS,
  payload: {}
});

export const handleError = (error: Error, customErrorMessage: string): { type: string; payload: IErrorToHandle } => ({
  type: HANDLE_ERROR,
  payload: {
    error,
    customErrorMessage
  }
});
