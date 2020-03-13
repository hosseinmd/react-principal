import React, { createContext, useContext } from "react";
import invariant from "invariant";
/**
 * @template S
 * @typedef {object} Store
 * @property {() => S} useState
 * @property {() => (state: S) => void} useDispatch
 */

/**
 * @template T
 * @typedef {({state: T, initialState: T}) => void} Middleware
 */

/**
 * @template S
 * @typedef {object} PrivateStore
 * @property {() => S} useState
 * @property {import("react").Context<S>} stateContext
 * @property {import("react").Context<() => void>} dispatchContext
 * @property {() => any} reducer
 * @property {S} initialState
 * @property {Middleware<S>} middleware
 *
 */

/**
 * @template T
 * @param {object} param0
 * @param {() => any} param0.reducer
 * @param {T} param0.initialState
 * @param {Middleware<T>} param0.middleware
 * @returns {Store<T>}
 */
export const createStore = ({ reducer, initialState, middleware }) => {
  const stateContext = createContext(initialState, calculateChangedBits);
  const dispatchContext = createContext(() => {});

  /**@type {PrivateStore<T>} */
  const store = {
    stateContext,
    dispatchContext,
    reducer,
    initialState,
    middleware,
    useState: nextObserveState => {
      return useContextWithObserve(stateContext, nextObserveState);
    },
    useDispatch: () => useContext(dispatchContext),
  };

  return store;
};

const useContextWithObserve = (context, nextObserveState) => {
  const mappedState =
    nextObserveState?.(context._currentValue) ?? context._currentValue;

  if (__DEV__) {
    invariant(
      typeof mappedState === "object",
      `nextObserveState expected return object but return ${typeof mappedState}`,
    );
  }

  const keys = getKeys(context._currentValue);

  const observeBit = getBits(keys, mappedState);

  return readContext(context, observeBit);
};

const getKeys = obj => {
  return Object.keys(obj).sort();
};

const calculateChangedBits = (prev, next) => {
  let changed = {};
  const keys = getKeys(next);

  if (__DEV__) {
    invariant(
      keys.length < 32,
      `expected return state have property least than 32 but has ${keys.length} property`,
    );
  }

  keys.forEach(key => {
    if (prev[key] !== next[key]) {
      changed[key] = next[key];
    }
  });

  const result = getBits(keys, changed);

  return result;
};

const getBits = (keys, usage) => {
  let result = 0;
  keys.forEach((key, index) => {
    if (usage.hasOwnProperty(key)) {
      // eslint-disable-next-line no-bitwise
      result |= 1 << index % 31;
    }
  });
  return result;
};

const ReactCurrentDispatcher =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    .ReactCurrentDispatcher;

function readContext(Context, observedBits) {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error(
      "react-cache: read and preload may only be called from within a " +
        "component's render. They are not supported in event handlers or " +
        "lifecycle methods.",
    );
  }
  return dispatcher.readContext(Context, observedBits);
}
