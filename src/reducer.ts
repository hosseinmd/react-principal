import { Reducer } from "./types";

type HandlerAction<S> = {
  type: any;
  payload: S;
};
type Handlers<STATE, ACTION = HandlerAction<STATE>> = {
  [type: string]: Reducer<STATE, ACTION>;
};

type CreateReducer = <
  STATE = any,
  ACTION extends HandlerAction<any> = HandlerAction<STATE>,
>(
  handlers: Handlers<STATE, ACTION>,
) => Reducer<STATE, ACTION>;

export const createReducer: CreateReducer = (handlers) => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};
