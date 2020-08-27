import React, {
  useReducer,
  useCallback,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Store, PrivateStore } from "./createStore";

interface ProviderProps<T> {
  store: Store<T>;
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
      const {
        reducer,
        initialState,
        stateContext,
        dispatchContext,
      } = store as PrivateStore<any>;
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

type ProvidersListProps = {
  providers: ((props: any) => JSX.Element)[];
  children: JSX.Element;
};

function ProvidersList({ children, providers = [] }: ProvidersListProps) {
  return providers.reduce((previousValue, Current, index) => {
    return <Current key={String(index)}>{previousValue}</Current>;
  }, children);
}

export { Provider, ProvidersList };
