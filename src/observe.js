// @ts-check
import React from "react";
import invariant from "invariant";
import { __DEV__ } from "./utils";

function useContextWithObserve(context, nextObserveState) {
  const stateKeys = getKeys(context._currentValue);

  let observeKeys = stateKeys;

  if (nextObserveState) {
    if (__DEV__) {
      invariant(
        Array.isArray(nextObserveState),
        `nextObserveState expected to be an Array of string but ${typeof nextObserveState} was received`,
      );
    }
    observeKeys = nextObserveState;
  }

  const observeBit = getBits(stateKeys, observeKeys);

  return readContext(context, observeBit);
}

function getKeys(obj) {
  return Object.keys(obj).sort();
}

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

  const result = getBits(keys, changed);

  return result;
}

function getBits(keys, usage) {
  let result = 0;
  keys.forEach((key, index) => {
    if (usage.hasOwnProperty(key)) {
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
