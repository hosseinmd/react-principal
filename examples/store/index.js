import { createStore } from "../../lib";
import reducer from "./reducers";
import initialState from "./initialState";

export * from "./actions";

export const ExampleStoreTheme = createStore({
  reducer,
  initialState,
});
