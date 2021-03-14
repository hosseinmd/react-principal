import { createContext, useContext } from "react";
import { useObserveContext, createObserveContext } from "./observe";
import { INITIALIZE_STATE_FROM_STORAGE } from "./persist";
import { Reducer } from "./types";
export interface Store<S> {
  useState(nextObserveState?: (keyof S)[]): S;
  useDispatch(): (action: any, callback?: () => void) => void;
  persist(
    state: S,
    action: {
      type: any;
    },
  ): void;
  setToState(): Promise<void>;
  dispatch: (action: any, callback?: () => void) => void;
  state: S;
}

export interface PrivateStore<S> extends Store<S> {
  stateContext: React.Context<S>;
  dispatchContext: React.Context<(action: any, callback?: () => void) => void>;
  reducer: Reducer<S>;
  initialState: S;
  persistKey: string;
}

/**
 * This function give you an store, use that in your components which want to
 * connect to store and provider
 */
export const createStore = <T extends { [x: string]: any }>({
  reducer,
  initialState,
  mapStateToPersist,
  Storage = window.localStorage,
  persistKey,
}: {
  reducer: Reducer<T>;
  initialState: T;
  Storage: any;
  persistKey: string;
  mapStateToPersist?: (state: T) => Partial<T>;
}): Store<T> => {
  const stateContext = createObserveContext(initialState);
  const dispatchContext = createContext<(action: any, callback?: any) => void>(
    () => {},
  );

  const store: PrivateStore<T> = {
    persistKey,
    dispatch: () => {},
    state: initialState,
    stateContext,
    dispatchContext,
    reducer,
    initialState,
    useState: (nextObserveState?: (keyof T)[]): T => {
      return useObserveContext(stateContext, nextObserveState);
    },
    useDispatch: () => useContext(dispatchContext),
    persist(state: T, action: { type: any }) {
      if (action.type !== INITIALIZE_STATE_FROM_STORAGE) {
        Storage.setItem(
          persistKey,
          JSON.stringify(mapStateToPersist ? mapStateToPersist(state) : state),
        );
      }
    },

    async setToState() {
      try {
        const storedState = await Storage.getItem(persistKey);

        if (!storedState) {
          return;
        }

        const stateObject = JSON.parse(storedState);

        const { dispatch } = store;
        const mappedState = mapStateToPersist
          ? mapStateToPersist(stateObject)
          : stateObject;

        dispatch({
          type: INITIALIZE_STATE_FROM_STORAGE,
          payload: mappedState,
        });

        /** Listening to events between tabs */
        window.addEventListener?.("storage", (event) => {
          if (event.key === persistKey && event.newValue !== event.oldValue) {
            dispatch({
              type: INITIALIZE_STATE_FROM_STORAGE,
              payload: event.newValue
                ? JSON.parse(event.newValue)
                : event.newValue,
            });
          }
        });
      } catch (error) {
        if (__DEV__) {
          console.error(error);
        }
      }
    },
  };

  return store as Store<T>;
};
