[![NPM](https://nodei.co/npm/react-principal.png)](https://nodei.co/npm/react-principal/)

[![install size](https://packagephobia.now.sh/badge?p=react-principal)](https://packagephobia.now.sh/result?p=react-principal) [![dependencies](https://david-dm.org/hosseinmd/react-principal.svg)](https://david-dm.org/hosseinmd/react-principal.svg)

# React-Principal

A state management with react context for apps which using hooks.
Acutely, react-principal is a wrapper for react context with better developer experience.
High performance since provided observed connect to context.
It's useful for global state management and complex component state.

React-Principal internally used React.reducer for state.

## Use

Before any think you should know react reducer pattern.

```js
import { createStore, Provider } from "react-principal";

const store = createStore({ reducer, initialState });

function Component() {
  const { foo, bar } = store.useState();
  const dispatch = store.useDispatch();

  return (
    <>
      <p>
        {foo} {bar}
      </p>
      <button
        onclick={
          () => dispatch({ type: "SET_FOO", payload: { foo: "foo" } }, callback)
          // callback will call after state set
        }
      >
        Set foo
      </button>
    </>
  );
}

// you can define the provider top of any where, which you want to use a store
function App() {
  <Provider store={store}>
    <Component />
  </Provider>;
}
```

## Performance

```js
const { foo, bar } = store.useState(["foo", "bar"]); //define states which you want to update when they changed. if is not defined store listen to whole states change

// Divided dispatch from state for performance, because dispatch function never change
const dispatch = store.useDispatch();
```

## Example

Visit Examples folder for more understand react-principal usage

A simple [Todo list App](https://github.com/hosseinmd/react-principal/blob/master/examples/web/src/app.js)

### persist

```js
const store = createStore({
  reducer,
  initialState,
  // config a persister
  // AsyncStorage for react-native
  storage: window.localStorage,
  persistKey: "UniqKey",
  mapStateToPersist: ({ todos }) => ({
    todos, // persist just todos
  }),
});

export default () => {
  // you can save ref in global place for access to state and dispatch out of children components like `store.state`
  // Doesn't need middleWare like redux, storeRef working vary well

  useEffect(() => {
    store.setToState();
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
```

## ProvidersList

This component is for organization providers

```js
function App() {
  return (
    <ProvidersList providers={[Provider1, Provider2, Provider3]}>
      {appContainer}
    </ProvidersList>
  );
}
```

### Utils

[Utils Readme.md](UtilsReadme.md).

### Generator

React-principal has a command for auto generating store

`$ generate-store <destination>`

    Options
    --type=<local | global>   Default is global, local is using with useReducer

For example:
`$ generate-store ./src/store`
Generate a sample store into src/store

`$ generate-store ./src/myComponent` --type=local
Generate a sample reducer action for using in useReducer into src/myComponent
