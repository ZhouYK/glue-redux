export interface Glue {
  [index:string]: any;
}

interface Action {
  type: string,
  data: any
}

interface Dispatch {
  (p: any): any;
}

type ActionCreator = (data: any) => any;

type Reducer = (state: any, action:Action ) => any;

interface CreateGlue<T> {
  <T>(module: T, defaultValue?: T): T;
}

interface GluePair {
  (actionCreator: ActionCreator, reducer: Reducer): Generator;
}

interface Gluer {
  (reducer: Reducer, actionCreator?: ActionCreator): Generator;
}

interface DestructParms {
  dispatch: Dispatch;
}
interface DestructReturn {
  (structure: Glue): Glue;
}
interface Destruct {
  (p: DestructParms): DestructReturn;
}

export const createGlue: CreateGlue<Glue>;

export const gluePair:GluePair;

export const gluer:Gluer;

export const destruct:Destruct;