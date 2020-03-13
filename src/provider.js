//@ts-check
import React, {
  useReducer,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";

/**
 * @type {React.FC<{store: any, dispatchListener: () => void}>}
 */
export const Provider = memo(
  forwardRef((props, ref) => {
    const { children, store } = props;

    /**@type {import("./createStore").PrivateStore<{}>} */
    const {
      reducer,
      initialState,
      middleware,
      stateContext,
      dispatchContext,
    } = store;
    const [state, dispatch] = useReducer(reducer, initialState);

    const dispatchWrapped = useCallback(
      (...arg) => {
        // @ts-ignore
        dispatch(...arg);
        // @ts-ignore
        props.dispatchListener?.(...arg);
      },
      [props],
    );

    middleware?.({ state, initialState });

    useImperativeHandle(
      ref,
      () => ({
        state,
        dispatch: dispatchWrapped,
      }),
      [dispatchWrapped, state],
    );

    return (
      <dispatchContext.Provider value={dispatchWrapped}>
        <stateContext.Provider value={state}>{children}</stateContext.Provider>
      </dispatchContext.Provider>
    );
  }),
);
