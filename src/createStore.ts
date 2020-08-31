import { createContext, useContext, Context } from "react";
import { calculateChangedBits, useContextWithObserve } from "./observe";
import { Reducer } from "./types";
export interface Store<S> {
  useState(nextObserveState?: (keyof S)[]): S;
  useDispatch(): (action: any) => void;
}

export interface PrivateStore<S> {
  useState(nextObserveState?: (keyof S)[]): S;
  useDispatch(): (action: any) => void;
  stateContext: React.Context<S>;
  dispatchContext: React.Context<(action: any) => void>;
  reducer: Reducer;
  initialState: S;
}

/**
 * This function give you an store, use that in your components which want to
 * connect to store and provider
 */
export const createStore = <T extends { [x: string]: any }>({
  reducer,
  initialState,
}: {
  reducer: Reducer;
  initialState: T;
}): Store<T> => {
  const stateContext = createContext(initialState, calculateChangedBits);
  const dispatchContext = createContext<(action: any) => void>(() => {});

  const store: PrivateStore<T> = {
    stateContext,
    dispatchContext,
    reducer,
    initialState,
    useState: (nextObserveState?: (keyof T)[]): T => {
      return useContextWithObserve(stateContext, nextObserveState);
    },
    useDispatch: () => useContext(dispatchContext),
  };

  return store as Store<T>;
};
