import { TOGGLE_TAB } from "./actionTypes";

export const toggleSelectedTab = (id: number) => ({
  type: TOGGLE_TAB,
  payload: {
    id
  }
});
