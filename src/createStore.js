// @ts-check
import { createContext, useContext } from "react";
import { calculateChangedBits, useContextWithObserve } from "./observe";

/**
 * @template S
 * @typedef {object} Store
 * @property {(nextObserveState: (keyof S)[]) => S} useState
 * @property {() => (state: S) => void} useDispatch
 */

/**
 * @template S
 * @typedef {object} PrivateStore
 * @property {() => S} useState
 * @property {() => () => void} useDispatch
 * @property {React.Context<S>} stateContext
 * @property {React.Context<() => void>} dispatchContext
 * @property {() => any} reducer
 * @property {S} initialState
 */

/**
 * This function give you an store, use that in your components which want to
 * connect to store and provider
 *
 * @template T
 * @param {object} param0
 * @param {() => any} param0.reducer
 * @param {T} param0.initialState
 * @returns {Store<T>}
 */
export const createStore = ({ reducer, initialState }) => {
  const stateContext = createContext(initialState, calculateChangedBits);
  const dispatchContext = createContext(() => {});

  /** @type {PrivateStore<T>} */
  const store = {
    stateContext,
    dispatchContext,
    reducer,
    initialState,
    useState: (nextObserveState) => {
      return useContextWithObserve(
        stateContext,
        initialState,
        nextObserveState,
      );
    },
    useDispatch: () => useContext(dispatchContext),
  };

  return store;
};
