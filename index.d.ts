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

interface GluerReturn {
  (p:any): any;
}

type ActionCreator = (data: any) => any;

type Reducer = (state: any, action:Action ) => any;

interface CreateGlue<T> {
  <T>(module: T, defaultValue?: T): T;
}

interface GluePair {
  (actionCreator: ActionCreator, reducer: Reducer): GluerReturn;
}

interface Gluer {
  (reducer: Reducer, actionCreator?: ActionCreator): GluerReturn;
}

interface DestructParams {
  dispatch: Dispatch;
}
interface DestructReturn {
  (structure: Glue): Glue;
}
interface Destruct {
  (p: DestructParams): DestructReturn;
}

/**
 * @deprecated
 */
export const createGlue: CreateGlue<Glue>;
/**
 * @deprecated
 */
export const gluePair:GluePair;

export const gluer:Gluer;

export const destruct:Destruct;