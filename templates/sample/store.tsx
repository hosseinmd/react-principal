import React, { ReactNode, createRef } from "react";
import {
  createStore,
  persisterCreator,
  Provider as RPProvider,
} from "react-principal";
import { reducer } from "./reducer";
import { initialState, InitialState } from "./initialState";

let _ref = createRef<any>();

export const Store = createStore({
  reducer,
  initialState,
});

export const persist = persisterCreator<typeof initialState>(
  window.localStorage, // use AsyncStorage for react-native
  "react-principal:Sample",
  ({ name }) => ({
    name,
  }),
  _ref,
);

export const initialStoreFromStorage = async () => {
  await persist.setToState(_ref);
};

export const getState = (): InitialState => _ref.current?.state;
export const getDispatch = () => _ref.current?.dispatch;

export const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <RPProvider ref={_ref} onStateDidChange={persist.persist} store={Store}>
      {children}
    </RPProvider>
  );
};
