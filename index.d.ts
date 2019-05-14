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
type HandleFunc<T> = (data: any, state: T) => T;

type fnc<T> = (data?: T) => T;
type GluerReturn<T>  = {
  readonly [P in keyof T]: T[P];
} & fnc<T> & {
  actionType: string
};

export declare function gluer(fn: HandleFunc<any> ) : GluerReturn<{}>;
export declare function gluer<T>(initialState: T) : GluerReturn<T>;
export declare function gluer<T>(fn: HandleFunc<T>, initialState: T) : GluerReturn<T>;
export const destruct: Destruct;
