//@ts-check
/** @typedef {(state: any, action: { type: string; payload: any }) => any} ReducerItem */

/** @param {{ [type: string]: ReducerItem }} handlers */
export const createReducer = (handlers) => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};
