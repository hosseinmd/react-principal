import { INITIALIZE_STATE_FROM_STORAGE } from "./persist";
import { Reducer } from "./types";

type Handlers<STATE> = {
  [type: string | symbol]: Reducer<STATE>;
};

type CreateReducer = <STATE = any>(handlers: Handlers<STATE>) => Reducer<STATE>;

export const createReducer: CreateReducer = (handlers) => (state, action) => {
  if (action.type === INITIALIZE_STATE_FROM_STORAGE) {
    return { ...state, ...action.payload };
  }

  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action as any);
};
