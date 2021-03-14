import renderer, { act } from "react-test-renderer";
import React from "react";
import { ExampleStoreTheme, changeTheme } from "../examples/persistStore";
import { Provider } from "../lib";

function TextInputTester() {
  const { theme } = ExampleStoreTheme.useState(["theme"]);
  return <p theme={theme} />;
}

const App = () => {
  return (
    <Provider store={ExampleStoreTheme}>
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
    } = ExampleStoreTheme;
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
    await ExampleStoreTheme.setToState();
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
