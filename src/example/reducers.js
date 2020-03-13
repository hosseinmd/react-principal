import * as types from "./types";
import { createReducer } from "../";

export default createReducer({
  [types.TOGGLE]: (state, { payload: { theme } }) => ({
    ...state,
    theme,
  }),
});
