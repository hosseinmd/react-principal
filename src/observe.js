// @ts-check

import React from "react";
import invariant from "invariant";
import { __DEV__ } from "./utils";

/**
 * @param {React.Context<any>} context
 * @param {any} initialState
 * @param {string[]} nextObserveState
 */
function useContextWithObserve(context, initialState, nextObserveState) {
  const stateKeys = getKeys(
    // @ts-ignore
    initialState,
  );

  // default observe to whole state
  let observeKeys = stateKeys;

  if (nextObserveState) {
    if (__DEV__) {
      invariant(
        Array.isArray(nextObserveState),
        `useState: nextObserveState expected to be an Array of string but ${typeof nextObserveState} was received`,
      );
      nextObserveState.forEach((observeKey) => {
        invariant(
          stateKeys.includes(observeKey),
          `useState: nextObserveState expected to be an Array of state keys but ${observeKey} is not one of the state`,
        );
      });
    }
    observeKeys = nextObserveState.sort();
  }

  const observeBit = getBits(stateKeys, observeKeys);

  return readContext(context, observeBit);
}

/** @param {{}} obj */
function getKeys(obj) {
  return Object.keys(obj).sort();
}

/**
 * @param {{ [x: string]: any }} prev
 * @param {any} next
 */
function calculateChangedBits(prev, next) {
  let changed = {};
  const keys = getKeys(next);

  if (__DEV__) {
    invariant(
      keys.length < 32,
      `expected return state have property least than 32 but has ${keys.length} property`,
    );
  }

  keys.forEach((key) => {
    if (prev[key] !== next[key]) {
      changed[key] = next[key];
    }
  });

  const changedKeys = getKeys(changed);

  const result = getBits(keys, changedKeys);

  return result;
}

/**
 * @param {string[]} keys
 * @param {string[]} usage
 */
function getBits(keys, usage) {
  let result = 0;
  /**
   * @param {string} key
   * @param {number} index
   */
  keys.forEach((key, index) => {
    if (usage.includes(key)) {
      // eslint-disable-next-line no-bitwise
      result |= 1 << index % 31;
    }
  });

  return result;
}

const ReactCurrentDispatcher =
  // @ts-ignore
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    .ReactCurrentDispatcher;

/**
 * @param {any} Context
 * @param {number} observedBits
 */
function readContext(Context, observedBits) {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error(
      "react-principal: useState and useDispatch may only be called from within a " +
        "component's render. They are not supported in event handlers or " +
        "lifecycle methods.",
    );
  }
  return dispatcher.readContext(Context, observedBits);
}

export { calculateChangedBits, useContextWithObserve };
