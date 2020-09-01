import { Reducer, Action } from "./types";

type Handlers<STATE, ACTION> = {
  [type: string]: Reducer<STATE, ACTION>;
};

type CreateReducer = <STATE = any, ACTION extends Action = Action>(
  handlers: Handlers<STATE, ACTION>,
) => Reducer<STATE, ACTION>;

export const createReducer: CreateReducer = (handlers) => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};
