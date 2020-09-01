export type Action = {
  type: any;
  payload?: any;
};

export type Reducer<S, A = Action> = (state: S, action: A) => S;
