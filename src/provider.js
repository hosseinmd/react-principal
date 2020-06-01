//@ts-check
import React, {
  useReducer,
  useCallback,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useMemo,
} from "react";

/**
 * @template T
 * @typedef {object} ProviderProps
 * @property {(state: T, lastAction: {})=> void} [onStateDidChange]
 * @property {(state: T)=> any} [initializer]
 * @property {import("./createStore").Store<T>} store
 * @property {React.Ref<{state: T, dispatch: () => void}>} [ref]
 */

/**
 * @template T
 * @type {React.FC<ProviderProps<T>>}
 */
export const Provider = memo(
  forwardRef(({ children, store, onStateDidChange, initializer }, ref) => {
    /**@type {import("./createStore").PrivateStore<{}>} */
    // @ts-ignore
    const { reducer, initialState, stateContext, dispatchContext } = store;
    const [state, dispatch] = useReducer(reducer, initialState, initializer);
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
        <stateContext.Provider value={state}>{children}</stateContext.Provider>
      </dispatchContext.Provider>
    );
  }),
);

function useHandleRef(ref, object) {
  useMemo(() => {
    if (ref && "current" in ref) {
      ref.current = object;
    } else if (typeof ref === "function") {
      ref(object);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, Object.values(object)]);
}
