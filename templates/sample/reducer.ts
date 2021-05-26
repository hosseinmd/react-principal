import { SET_NAME } from "./types";
import { createReducer } from "react-principal";
import { InitialState } from "./initialState";

const reducer = createReducer<InitialState>({
  [SET_NAME]: (state, { payload: { name } }) => ({
    ...state,
    name,
  }),
});

export { reducer };
