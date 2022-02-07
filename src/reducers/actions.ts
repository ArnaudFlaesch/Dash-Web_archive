import { TOGGLE_TAB, TOGGLE_REFRESH_WIDGETS } from './actionTypes';

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
