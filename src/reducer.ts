import { Reducer } from "./types";

export const createReducer = (handlers: {
  [type: string]: Reducer;
}): Reducer => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};
