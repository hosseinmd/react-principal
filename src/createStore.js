// @ts-check
import { createContext, useContext } from "react";
import { calculateChangedBits, useContextWithObserve } from "./observe";

/**
 * @template S
 * @typedef {object} Store
 * @property {(nextObserveState: () => S) => S} useState
 * @property {() => (state: S) => void} useDispatch
 */

/**
 * @template S
 * @typedef {object} PrivateStore
 * @property {() => S} useState
 * @property {() => () => void} useDispatch
 * @property {import("react").Context<S>} stateContext
 * @property {import("react").Context<() => void>} dispatchContext
 * @property {() => any} reducer
 * @property {S} initialState
 */

/**
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
      return useContextWithObserve(stateContext, nextObserveState);
    },
    useDispatch: () => useContext(dispatchContext),
  };

  return store;
};
