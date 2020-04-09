//@ts-check
import { __DEV__ } from "./utils";

const INITIALIZE_STATE_FROM_STORAGE = Symbol();

/**
 * @param {any} Storage
 * @param {string} key
 * @param {(state: {}) => any } mapStateToPersist
 */
export const persisterCreator = function persisterCreator(
  Storage,
  key,
  mapStateToPersist,
) {
  return {
    /**
     * @param {{}} state
     * @param {{type: any}} action
     */
    persist(state, action) {
      if (action.type !== INITIALIZE_STATE_FROM_STORAGE) {
        Storage.setItem(
          key,
          JSON.stringify(mapStateToPersist ? mapStateToPersist(state) : state),
        );
      }
    },

    /**
     * @param {any} storeRef
     */
    async setToState(storeRef) {
      try {
        const storedState = await Storage.getItem(key);

        if (!storedState) {
          return;
        }

        const stateObject = JSON.parse(storedState);

        const { dispatch } = storeRef.current;
        const mappedState = mapStateToPersist
          ? mapStateToPersist(stateObject)
          : stateObject;

        dispatch({
          type: INITIALIZE_STATE_FROM_STORAGE,
          payload: mappedState,
        });
      } catch (error) {
        if (__DEV__) {
          console.error(error);
        }
      }
    },
  };
};

export const persistReducer = reducer => (state, action) => {
  if (action.type === INITIALIZE_STATE_FROM_STORAGE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};
