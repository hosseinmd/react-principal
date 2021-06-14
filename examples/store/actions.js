import * as types from "./types";

export const changeTheme = (theme) => ({
  type: types.TOGGLE,
  payload: { theme },
});

export const wrongAction = () => ({
  type: types.WRONG,
});
