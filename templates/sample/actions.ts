import { SET_NAME } from "./types";

function setName(name: string) {
  return {
    type: SET_NAME,
    payload: { name },
  };
}

export { setName };
