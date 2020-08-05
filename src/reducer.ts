type ReducerItem = (state: any, action: { type: string; payload: any }) => any;

export const createReducer = (handlers: { [type: string]: ReducerItem }) => (
  state: any,
  action: any,
) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};
