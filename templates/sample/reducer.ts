import { SET_NAME } from "./types";
import { createReducer, persistReducer } from "react-principal";
import { InitialState } from "./initialState";

const reducer = persistReducer(
  createReducer<InitialState>({
    [SET_NAME]: (state, { payload: { name } }) => ({
      ...state,
      name,
    }),
  }),
);

export { reducer };
