import * as types from "./types";
import { createReducer } from "../../lib";

export default createReducer({
  [types.TOGGLE]: (state, { payload: { theme } }) => ({
    ...state,
    theme,
  }),
  [types.WRONG]: (state) => ({
    ...state,
    WRONG: true,
  }),
});
