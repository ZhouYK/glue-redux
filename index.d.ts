interface Glue {
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

type Generator = () => Iterator;

interface GluePair {
  (actionCreator: ActionCreator, reducer: Reducer): Generator;
}
declare const createGlue: CreateGlue<Glue>;

declare const gluePair:GluePair;