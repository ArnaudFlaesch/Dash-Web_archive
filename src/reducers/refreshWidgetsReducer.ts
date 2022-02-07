import { TOGGLE_REFRESH_WIDGETS } from './actionTypes';

export interface IRefreshWidgetState {
  toggleRefreshWidgets: boolean;
}

const initialState: IRefreshWidgetState = {
  toggleRefreshWidgets: false
};

export default function (
  state = initialState,
  action: { type: string; payload: Record<string, never> }
): IRefreshWidgetState {
  switch (action.type) {
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
