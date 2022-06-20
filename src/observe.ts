import React, { createContext, useRef } from "react";
//@ts-ignore
import invariant from "invariant";
import { __DEV__ } from "./utils";

function useObserveContext<T>(context: React.Context<T>): T {
  const stateKeys = getKeys((context as any)._currentValue);

  // default observe to whole state
  const observeKeys = useRef(new Set(stateKeys));

  const observeBit = getBits(stateKeys, [...observeKeys.current].sort());

  const state = readContext(context, observeBit);

  return new Proxy(state, {
    get(target, key) {
      if (key in target) {
        observeKeys.current.add(key as string);
        return target[key];
      }
    },
  });
}

function getKeys(obj: object) {
  return Object.keys(obj).sort();
}

function calculateChangedBits(prev: { [x: string]: any }, next: any) {
  let changed: { [x: string]: any } = {};
  const keys = getKeys(next);

  if (__DEV__) {
    const prevKeys = getKeys(prev);

    if (prevKeys.length !== keys.length) {
      let missedStates = prevKeys.filter((v) => !keys.includes(v));

      missedStates = [
        ...missedStates,
        ...keys.filter((v) => !prevKeys.includes(v)),
      ];

      invariant(
        prevKeys.length === keys.length,
        `expected the number of states will not change, ${missedStates} is missed`,
      );
    }

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

function getBits(keys: string[], usage: string[]) {
  let result = 0;
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

function readContext(Context: any, observedBits: number) {
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

function createObserveContext<T>(defaultValue: T) {
  return createContext(defaultValue, calculateChangedBits);
}

export { calculateChangedBits, useObserveContext, createObserveContext };
