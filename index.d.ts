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

interface GluerReturn<T = any> {
  (data?: T): T;
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
export declare function gluer(fn: (data: any, state: any) => any) : GluerReturn;
export declare function gluer(initialState: string | number | null | {} | boolean | undefined) : GluerReturn;
export declare function gluer(fn: (data: any, state: any) => any, initialState: any) : GluerReturn;
export const destruct: Destruct;
