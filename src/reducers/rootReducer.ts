import { TOGGLE_TAB, TOGGLE_REFRESH_WIDGETS } from './actionTypes';

export interface IReducerState {
  activeTab: number;
  toggleRefreshWidgets: boolean;
}

const initialState: IReducerState = {
  activeTab: -1,
  toggleRefreshWidgets: false
};

export default function (state = initialState, action: { type: string; payload: unknown }): IReducerState {
  switch (action.type) {
    case TOGGLE_TAB: {
      const { id } = action.payload as { id: number };
      return {
        ...state,
        activeTab: id
      };
    }
    case TOGGLE_REFRESH_WIDGETS: {
      return {
        ...state,
        toggleRefreshWidgets: !state.toggleRefreshWidgets
      };
    }
    default:
      return state;
  }
}
