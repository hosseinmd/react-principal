import { createStore } from "../../lib";
import reducer from "./reducers";
import initialState from "./initialState";

export * from "./actions";

const StorageMock = {
  data: {},
  setItem(key, data) {
    this.data[key] = data;
  },
  getItem(key) {
    return this.data[key];
  },
};

export const ExampleStoreTheme = createStore({
  reducer,
  initialState,
  Storage: StorageMock,
  persistKey: "Theme",
});
