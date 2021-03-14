import React, { useReducer, useCallback, useEffect, useRef } from "react";
import { Store, PrivateStore } from "./createStore";
import { Action } from "./types";

interface ProviderProps<T> {
  store: Store<T>;
  onStateDidChange?: (state: T, lastAction: any) => void;
  initializer?: (state: T) => any;
  ref?: React.Ref<{ state: T; dispatch: () => void }>;
  children: any;
}

const Provider = <T extends {}>({
  children,
  store,
  onStateDidChange,
  initializer,
}: ProviderProps<T>) => {
  const {
    reducer,
    initialState,
    stateContext,
    dispatchContext,
    persistKey,
    persist,
  } = store as PrivateStore<any>;
  const callbackRef = useRef<any[]>([]);
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    initializer as any,
  );

  const lastAction = useRef<Action<T>>();

  useEffect(() => {
    if (state) {
      const callbacks = callbackRef.current;
      callbackRef.current = [];
      callbacks.forEach((callback) => callback());
    }
  }, [state]);

  const dispatchWrapped = useCallback((action, callback) => {
    lastAction.current = action;
    // @ts-ignore
    dispatch(action);

    if (callback) {
      callbackRef.current.push(callback);
    }
  }, []);

  Object.assign(store, {
    dispatch: dispatchWrapped,
    state,
  });

  useEffect(() => {
    if (lastAction.current) {
      onStateDidChange?.(state, lastAction.current);

      if (persistKey) {
        persist(state, lastAction.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <dispatchContext.Provider value={dispatchWrapped}>
      <stateContext.Provider value={state}>{children}</stateContext.Provider>
    </dispatchContext.Provider>
  );
};

type ProvidersListProps = {
  providers: ((props: any) => JSX.Element)[];
  children: JSX.Element | JSX.Element[];
};

function ProvidersList({ children, providers = [] }: ProvidersListProps) {
  return providers.reduce((previousValue, Current, index) => {
    return <Current key={String(index)}>{previousValue}</Current>;
  }, children) as JSX.Element;
}

export { Provider, ProvidersList };
