import { useEffect } from "react";

const types = {
  INITIALIZE_STATE_FROM_STORAGE: Symbol(),
};

/**
 * @param {any} Storage
 * @param {string} key
 * @param {(state: object) => object } mapStateToPersist
 * @returns {(state: object,initialState: object) => any}
 */
export const persistMiddleCreator = function persistMiddleCreator(
  Storage,
  key,
  mapStateToPersist,
) {
  return function usePersistMiddleware({ state, initialState }) {
    useEffect(() => {
      if (state !== initialState) {
        Storage.setItem(
          key,
          mapStateToPersist ? mapStateToPersist(state) : state,
        );
      }
    }, [state, initialState]);
  };
};

export const setStoredState = async (Storage, key, store) => {
  const storedState = await Storage.getItem(key);

  if (!storedState) {
    return;
  }

  const { dispatch } = store;

  dispatch({
    type: types.INITIALIZE_STATE_FROM_STORAGE,
    payload: storedState,
  });
};

export const persistReducer = reducer => (state, action) => {
  if (action.type === types.INITIALIZE_STATE_FROM_STORAGE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};
