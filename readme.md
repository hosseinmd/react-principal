[![NPM](https://nodei.co/npm/react-principal.png)](https://nodei.co/npm/react-principal/)

[![install size](https://packagephobia.now.sh/badge?p=react-principal)](https://packagephobia.now.sh/result?p=react-principal) [![dependencies](https://david-dm.org/poolkhord/react-principal.svg)](https://david-dm.org/poolkhord/react-principal.svg)

# react-principal

State management used react context for apps which using hooks.
High performance since provided observed connect to context.
It's useful for global state management and complex container components state.

## Example

```js
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { createStore, Provider } from "react-principal";

/*
 * ACTIONS (actions.js)
 */
let nextTodoId = 0;
const addTodo = text => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text,
  };
};

const setVisibilityFilter = filter => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter,
  };
};

const toggleTodo = id => {
  return {
    type: "TOGGLE_TODO",
    id,
  };
};

/*
 * REDUCERS (reducers.js)
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: action.id,
            text: action.text,
            completed: false,
          },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      };
    case "SET_VISIBILITY_FILTER":
      return {
        ...state,
        visibilityFilter: action.filter,
      };
    default:
      return state;
  }
};

const initialState = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
};

const store = createStore({ reducer, initialState });
```

### Use created store

Presentational Components

```js
const Todo = ({ completed, text, id }) => {
  const dispatch = store.useDispatch();
  const onTodoClick = e => {
    e.preventDefault();
    dispatch(toggleTodo(id));
  };
  return (
    <a
      href="#"
      onClick={onTodoClick}
      style={{
        textDecoration: completed ? "line-through" : "none",
      }}
    >
      <div className="d-flex w-100">
        <h5 className="mb-1">{text}</h5>
      </div>
    </a>
  );
};

const VisibleTodoList = () => {
  const { todos, visibilityFilter } = store.useState(state => ({
    todos: state.todos,
    visibilityFilter: state.visibilityFilter,
  }));

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <div className="todo-list">
      {visibleTodos.map(todo => (
        <Todo key={todo.id} {...todo} />
      ))}
    </div>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(t => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter(t => !t.completed);
  }
};

const FilterLink = ({ children, filter }) => {
  const dispatch = store.useDispatch();
  const { visibilityFilter } = store.useState(() => ({
    visibilityFilter: true,
  }));
  const active = filter === visibilityFilter;

  const onClick = () => {
    dispatch(setVisibilityFilter(filter));
  };

  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </p>
);

let AddTodo = () => {
  const dispatch = store.useDispatch();
  let input;

  return (
    <div>
      <form
        className="form-inline"
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(addTodo(input.value));
          input.value = "";
        }}
      >
        <input
          className="form-control col-md-10"
          ref={node => {
            input = node;
          }}
        />
        <button type="submit" className="btn btn-primary col-md-2">
          Add
        </button>
      </form>
    </div>
  );
};

const App = () => (
  <div>
    <h1>React Redux TODO App</h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);
```

### Provider

Add a Provider on app top level

```js
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
```
