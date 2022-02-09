import { IErrorToHandle } from './actions';
import { TOGGLE_TAB, TOGGLE_REFRESH_WIDGETS, HANDLE_ERROR } from './actionTypes';

export interface IReducerState {
  activeTab: number;
  toggleRefreshWidgets: boolean;
  errorToHandle?: IErrorToHandle;
}

const initialState: IReducerState = {
  activeTab: -1,
  toggleRefreshWidgets: false,
  errorToHandle: undefined
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
    case HANDLE_ERROR: {
      return {
        ...state,
        errorToHandle: {
          ...(action.payload as IErrorToHandle)
        }
      };
    }
    default:
      return state;
  }
}
