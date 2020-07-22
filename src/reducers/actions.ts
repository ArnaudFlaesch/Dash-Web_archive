import { TOGGLE_TAB } from "./actionTypes";

export const toggleSelectedTab = (id: string) => ({
  type: TOGGLE_TAB,
  payload: {
    id
  }
});
