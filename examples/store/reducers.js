import * as types from "./types";
import { createReducer, persistReducer } from "../../src";

export default persistReducer(
  createReducer({
    [types.TOGGLE]: (state, { payload: { theme } }) => ({
      ...state,
      theme,
    }),
  }),
);
