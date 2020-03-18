import renderer, { act } from "react-test-renderer";
import React, { useRef } from "react";
import { ExampleStoreTheme, changeTheme } from "../examples/store";
import { Provider, persisterCreator } from "../src";

const StorageMock = {
  data: {},
  setItem(key, data) {
    this.data[key] = data;
  },
  getItem(key) {
    return this.data[key];
  },
};

const persister = persisterCreator(StorageMock, "Theme");

const TextInputTester = function() {
  const { theme } = ExampleStoreTheme.useState(() => ({
    theme: true,
  }));
  return <p theme={theme} />;
};

let themeStoreRef;
const App = () => {
  themeStoreRef = useRef();
  return (
    <Provider
      ref={themeStoreRef}
      onStateDidChange={persister.persist}
      store={ExampleStoreTheme}
    >
      <TextInputTester />
    </Provider>
  );
};

let component;
let tree;
test("store: create theme store", async () => {
  component = renderer.create(<App />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  act(() => {
    const {
      dispatch,
      state: { theme },
    } = themeStoreRef.current;
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("store: create theme ", async () => {
  component = renderer.create(<App />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  await act(async () => {
    await persister.setToState(themeStoreRef);
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
