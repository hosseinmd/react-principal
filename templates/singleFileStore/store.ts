import { createReducer } from "react-principal";

const SET_NAME = Symbol();

interface InitialState {
  name: string;
}

const initialState: InitialState = {
  name: "",
};

const reducer = createReducer<InitialState>({
  [SET_NAME]: (state, { payload: { name } }) => ({
    ...state,
    name,
  }),
});

function setName(name: string) {
  return { type: SET_NAME, payload: { name } };
}

export { reducer, initialState, setName };
