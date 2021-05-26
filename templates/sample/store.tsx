import React, { ReactNode } from "react";
import { createStore, Provider as RPProvider } from "react-principal";
import { reducer } from "./reducer";
import { initialState } from "./initialState";

export const Store = createStore({
  reducer,
  initialState,
  storage: window.localStorage, // use AsyncStorage for react-native
  persistKey: "react-principal:Sample",
  mapStateToPersist: ({ name }) => ({
    name,
  }),
});

export const initialStoreFromStorage = async () => {
  await Store.setToState();
};

export const getState = () => Store.state;
export const getDispatch = () => Store.dispatch;

export const Provider = ({ children }: { children: ReactNode }) => {
  return <RPProvider store={Store}>{children}</RPProvider>;
};
