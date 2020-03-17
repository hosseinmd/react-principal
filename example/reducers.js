import * as types from "./types";
import { createReducer } from "../src";

export default createReducer({
  [types.TOGGLE]: (state, { payload: { theme } }) => ({
    ...state,
    theme,
  }),
});
