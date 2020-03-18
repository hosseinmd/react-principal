[![NPM](https://nodei.co/npm/react-principal.png)](https://nodei.co/npm/react-principal/)

[![install size](https://packagephobia.now.sh/badge?p=react-principal)](https://packagephobia.now.sh/result?p=react-principal) [![dependencies](https://david-dm.org/poolkhord/react-principal.svg)](https://david-dm.org/poolkhord/react-principal.svg)

# react-principal

A state management with react context for apps which using hooks.
High performance since provided observed connect to context.
It's useful for global state management and complex container components state.

## Use

```js
import { createStore, Provider } from "react-principal";

const store = createStore({ reducer, initialState });

// Param of useState give a function which define states which observe to next render don't effected on states which returned
const { foo, bar } = store.useState(state => ({
  foo: state.foo, // not matter what is amount, just define states which you want to observe for next render
  bar: true,
}));

// Divided dispatch from state for performance
const dispatch = store.useDispatch();

// you can define the provider top of any where, which you want to use a store
<Provider store={store}>
  <Other />
</Provider>;
```

## Example

A simple [Todo list App](https://github.com/poolkhord/react-principal/blob/master/examples/web/src/app.js)

### persist

```js
/// wrap reducer with
const reducer = persistReducer((state, action) => {
  // some reduce
});

// config a persister
const persister = persisterCreator(
  window.localStorage,
  "UniqKey",
  ({ todos }) => ({
    todos, // persist just todos
  }),
);

export default () => {
  const storeRef = useRef();
  // you can save ref in global place for access to state and dispatch out of children components.
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
