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
    <p>
      {foo} {bar}
    </p>
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
/// wrap reducer with
const reducer = persistReducer((state, action) => {
  // some reduce
});

// config a persister
const persister = persisterCreator(
  window.localStorage, // or react-native asyncStorage
  "UniqKey",
  ({ todos }) => ({
    todos, // persist just todos
  }),
);

export default () => {
  const storeRef = useRef();
  // you can save ref in global place for access to state and dispatch out of children components like `storeRef.current.state`
  // Doesn't need middleWare like redux, storeRef working vary well

  useEffect(() => {
    persister.setToState(storeRef);
  }, []);

  return (
    <Provider
      ref={storeRef}
      // for catch state changes
      onStateDidChange={persister.persist}
      store={store}
    >
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

<a href="./Utils Readme.md">Utils Readme.md</a>
