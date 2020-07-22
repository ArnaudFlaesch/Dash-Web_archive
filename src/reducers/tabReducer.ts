import { TOGGLE_TAB } from "./actionTypes";

export interface ITabState {
  activeTab: string
}

const initialState: ITabState = {
  activeTab: "-1"
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case TOGGLE_TAB: {
      const { id } = action.payload;
      return {
        ...state,
        activeTab : id
      };
    }
    default:
      return state;
  }
}