import React, {
  useReducer,
  useCallback,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { PrivateStore } from "./createStore";

interface ProviderProps<T> {
  store: PrivateStore<T>;
  onStateDidChange?: (state: T, lastAction: any) => void;
  initializer?: (state: T) => any;
  ref?: React.Ref<{ state: T; dispatch: () => void }>;
  children: any;
}

const Provider = memo(
  forwardRef(
    (
      { children, store, onStateDidChange, initializer }: ProviderProps<any>,
      ref,
    ) => {
      /** @type {import("./createStore").PrivateStore<{}>} */
      // @ts-ignore
      const { reducer, initialState, stateContext, dispatchContext } = store;
      const [state, dispatch] = useReducer(
        reducer,
        initialState,
        initializer as any,
      );
      const lastAction = useRef();

      const dispatchWrapped = useCallback((action) => {
        lastAction.current = action;
        // @ts-ignore
        dispatch(action);
      }, []);

      useHandleRef(ref, {
        state,
        dispatch: dispatchWrapped,
      });

      useEffect(() => {
        if (lastAction.current) onStateDidChange?.(state, lastAction.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [state]);

      return (
        <dispatchContext.Provider value={dispatchWrapped}>
          <stateContext.Provider value={state}>
            {children}
          </stateContext.Provider>
        </dispatchContext.Provider>
      );
    },
  ),
);

function useHandleRef(ref: any, object: any) {
  useMemo(() => {
    if (ref && "current" in ref) {
      ref.current = object;
    } else if (typeof ref === "function") {
      ref(object);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, Object.values(object)]);
}

interface ProvidersListProps {
  providers: React.ComponentType[];
  children: React.ReactElement;
}

function ProvidersList({ children, providers = [] }: ProvidersListProps) {
  return providers.reduce((previousValue, Current) => {
    return <Current>{previousValue}</Current>;
  }, children);
}

export { Provider, ProvidersList };
