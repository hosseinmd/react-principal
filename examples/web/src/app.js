/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useCallback } from "react";
import { createStore, Provider, createReducer } from "../../../lib";

/*
 * ACTIONS (actions.js)
 */
const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    text,
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter,
  };
};

const toggleTodo = (id) => {
  return {
    type: "TOGGLE_TODO",
    id,
  };
};

/*
 * REDUCERS (reducers.js)
 */
const reducer = createReducer({
  ADD_TODO: (state, action) => {
    const id = (state.todos[state.todos.length - 1]?.id || 0) + 1;
    return {
      ...state,
      todos: [
        ...state.todos,
        {
          id,
          text: action.text,
          completed: false,
        },
      ],
    };
  },
  TOGGLE_TODO: (state, action) => {
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      ),
    };
  },
  SET_VISIBILITY_FILTER: (state, action) => {
    return {
      ...state,
      visibilityFilter: action.filter,
    };
  },
});

const initialState = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
};

const store = createStore({
  reducer,
  initialState,
  storage: window.sessionStorage,
  persistKey: "TODO",
  mapStateToPersist: ({ todos }) => ({
    todos,
  }),
});

/*
 * Presentational Components
 */

const Todo = ({ completed, text, id }) => {
  const dispatch = store.useDispatch();
  const onTodoClick = (e) => {
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
  const { todos, visibilityFilter } = store.useState([
    "todos",
    "visibilityFilter",
  ]);

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <div className="todo-list">
      {visibleTodos.map((todo) => (
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
      return todos.filter((t) => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter((t) => !t.completed);
  }
};

const FilterLink = ({ children, filter }) => {
  const dispatch = store.useDispatch();
  const { visibilityFilter } = store.useState(["visibilityFilter"]);

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
      onClick={(e) => {
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
  const handleTestCallback = useCallback(() => {
    input.value = "";
  }, [input]);
  return (
    <div>
      <form
        className="form-inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(addTodo(input.value), handleTestCallback);
        }}
      >
        <input
          className="form-control col-md-10"
          ref={(node) => {
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
    <h1>React Principal TODO App</h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

export default () => {
  useEffect(() => {
    store.setToState();
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
