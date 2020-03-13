import React, { Suspense } from "react";
import { AppRegistry, View } from "react-native";
import Todo from "./app";

const App = () => {
  return (
    <Suspense fallback={<View />}>
      <Todo />
    </Suspense>
  );
};

AppRegistry.registerComponent("examples-web", () => App);
AppRegistry.runApplication("examples-web", {
  rootTag: document.getElementById("root"),
});
