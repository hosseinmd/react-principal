export type Action = {
  type: any;
  payload?: any;
};

export type Reducer<S, A = Action> = (state: S, action: A) => S;

export type Optional<T> = {
  [P in keyof T]?: T[P];
};
