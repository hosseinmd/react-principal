[![NPM](https://nodei.co/npm/react-principal.png)](https://nodei.co/npm/react-principal/)

[![install size](https://packagephobia.now.sh/badge?p=react-principal)](https://packagephobia.now.sh/result?p=react-principal) [![dependencies](https://david-dm.org/hosseinmd/react-principal.svg)](https://david-dm.org/hosseinmd/react-principal.svg)

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-react-principal">About React Principal</a>
      <ul>
        <li><a href="#pros">Pros</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul>
        <li><a href="#performance">Performance</a></li>
        <li><a href="#persist">persist</a></li>
        <li><a href="#providerslist">ProvidersList</a></li>
        <li><a href="#generator">Generator</a></li>
      </ul>
    <li><a href="#api">API</a></li>
    <li><a href="#utils">Utils</a></li>
    <li><a href="#examples">Examples</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

# About React Principal

React Principal is a state-management package based on react-context which introduces several hooks to do so.
Actually, react-principal is a wrapper for react context with better developer experience.
High performance since provided observed connect to context.
It's useful for global state management and complex component state.

React-Principal internally used React.reducer for state.

### Pros

Why should you use react-principal?
Because react-principal is:

- Ability to persist data using local storage and session
- Ability to create multiple providers for any component
- Pass data easily between various pages and tabs
- Applicable in both global and component-based levels
- Automatic store generation (CLI)
- TypeSafe
- High Performance
- User Friendly
- Minimum Complexity

### Built With

- [React](https://react.com)

<!-- GETTING STARTED -->

## Getting Started

All you need as a requirement for this package is to have a project created by react.

### Installation

To add react-principal to your project, simply install it using npm or yarn:

- npm

  ```sh
  npm install react-principal
  ```

- yarn
  ```sh
  yarn add react-principal
  ```

## Usage

Before anything, you should be familiar with react reducer pattern.

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

// The provider can be wrapped on any desired component, where you want to generate a store.
function App() {
  <Provider store={store}>
    <Component />
  </Provider>;
}
```

### Performance

```js
//Define states which you want to update when they changed. If is not defined store listen to whole states change
const { foo, bar } = store.useState(["foo", "bar"]);

// Dispatch is devided from state for performance enhancement, because dispatch functions never change.
const dispatch = store.useDispatch();
```

### persist

```js
const store = createStore({
  reducer,
  initialState,
  // config a persister
  // window.localStorage, window.sessionStorage, AsyncStorage supported
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

### ProvidersList

This component is for organization of multiple providers. Simply give the 'providers' prop, an array of your providers.

```js
function App() {
  return (
    <ProvidersList providers={[Provider1, Provider2, Provider3]}>
      {appContainer}
    </ProvidersList>
  );
}
```

### Generator

React-principal has a command for auto generating store.

`$ generate-store <destination>`

    Options
    --type=<reducer | single | global>   Default value is set on 'global', 'single' option will create store in a single file, reducer is using with useReducer,

##### Example:

`$ generate-store ./src/store`

     Generate a sample store into src/store

`$ generate-store ./src/myComponent --type=reducer`

    Generate a sample reducer action for using in useReducer into src/myComponent

## API

| Name              | Requirement |                    Type                    |                                    Description                                    |
| ----------------- | :---------: | :----------------------------------------: | :-------------------------------------------------------------------------------: |
| reducer           |  required   |                  function                  |         Pass your reducer function which is created via 'createReducer'.          |
| initialState      |  required   |                   object                   |   Here you can set the initial values that are going to be saved inside store.    |
| storage           |  optional   | localStorage, sessionStorage, AsyncStorage |     Choose from window.localStorage, window.sessionStorage, or AsyncStorage.      |
| persistKey        |  optional   |                   string                   |            To set a specific key to save data in the desired storage.             |
| mapStateToPersist |  optional   |                  function                  | A function which gets 'state' as an argument and saves it in the desired storage. |

## Utils

[Utils Readme.md](UtilsReadme.md).

## Examples

Visit 'examples' folder for a better understanding of react-principal usage.
Also, if you need to have a quick setup of this package on your project, you can check 'templates' folder.

A simple [Todo list App](https://github.com/hosseinmd/react-principal/blob/master/examples/web/src/app.js)

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Add tests if necessary and run tests (`yarn test`)
6. Open a Pull Request

<!-- CONTACT -->

## Contact

Hossein Mohammadi: hosseinm.developer@gmail.com

Project Link: [https://github.com/hosseinmd/react-principal](https://github.com/hosseinmd/react-principal)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [redux](https://redux.js.org/)
- [react-context](https://reactjs.org/docs/context.html)
