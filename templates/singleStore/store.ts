import { createReducer, createStore } from "react-principal";

const LOGIN = Symbol();
const LOGOUT = Symbol();

interface InitialState {
  accessToken?: string;
}

const initialState: InitialState = {
  accessToken: undefined,
};

const reducer = createReducer<InitialState>({
  [LOGIN]: (state, { payload: { accessToken } }) => ({
    ...state,
    accessToken,
  }),
  [LOGOUT]: () => ({
    ...initialState,
  }),
});

const AuthStore = createStore({
  reducer,
  initialState,
  persistKey: "AUTHENTICATION",
});

export { reducer, AuthStore };
