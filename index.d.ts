
export interface Glue {
  [index:string]: any;
}

interface Action {
  type: string,
  data: any
}

type ActionCreator = (data: any) => any;

type Reducer = (state: any, action:Action ) => any;

interface CreateGlue<T> {
  <T>(module: T, defaultValue?: T): T;
}

interface GluePair {
  (actionCreator: ActionCreator, reducer: Reducer): Generator;
}
export const createGlue: CreateGlue<Glue>;

export const gluePair:GluePair;