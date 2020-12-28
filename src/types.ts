export type Action<S> = {
  type: any;
  payload: S;
};

export type Reducer<S, A = Action<S>> = (state: S, action: A) => S;

export type Optional<T> = {
  [P in keyof T]?: T[P];
};
