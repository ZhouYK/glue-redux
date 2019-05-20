interface Glue {
  [index:string]: any;
}

interface DestructResult {
  reducers: {[index:string]: any},
  actions: {[index:string]: any},
  referToState: (model: any) => any,
  hasModel: (model: any) => boolean,
}

interface Dispatch {
  (p: any): any;
}

interface GetState {
  (p?: any): any;
}

interface DestructParams {
  dispatch: Dispatch;
  getState: GetState;
  [index: string]: any;
}
interface DestructReturn {
  (structure: Glue): DestructResult;
}
interface Destruct {
  (p: DestructParams): DestructReturn;
}

type HandleFunc<S, D = S> = (data: D, state: S) => S;

type fnc<D> = (data?: D) => D;
export type GluerReturn<S, D = S>  = {
  readonly [P in keyof S]: S[P];
} & fnc<D> & {
  actionType: string
};

export function gluer<S, D = S>(onlyOne?: HandleFunc<S, D> | S) : GluerReturn<S, D>;
export function gluer<S, D = S>(fn: HandleFunc<S, D>, initialState: S) : GluerReturn<S, D>;
export const destruct: Destruct;
