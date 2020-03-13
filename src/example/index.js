import { createStore, persistMiddleCreator, setStoredState } from "../index";
import reducer from "./reducers";
import initialState from "./initialState";

export * from "./actions";

export const ExampleStoreTheme = createStore({
  reducer,
  initialState,
  // middleware: persistMiddleCreator("Theme"),
});

// export const setStoredTheme = async () => {
//   await setStoredState("Theme", ExampleStoreTheme);
// };
