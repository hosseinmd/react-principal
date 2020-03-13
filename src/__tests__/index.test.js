import renderer, { act } from "react-test-renderer";
import React from "react";
import { ExampleStoreTheme, changeTheme } from "../example";
import { Provider } from "../index";

const TextInputTester = function() {
  const { theme } = ExampleStoreTheme.useState();
  const dispatch = ExampleStoreTheme.useDispatch();

  const toggleTheme = () => {
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));
  };

  return (
    <p theme={theme} toggleTheme={toggleTheme}>
      {theme}
    </p>
  );
};

let component;
let tree;
test("store: create theme store", () => {
  component = renderer.create(
    <Provider store={ExampleStoreTheme}>
      <TextInputTester />
    </Provider>,
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("store: toggle theme", () => {
  act(() => {
    tree.props.toggleTheme();
  });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
