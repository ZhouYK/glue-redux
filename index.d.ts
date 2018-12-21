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

interface GluerReturn {
  (data?: any): any;
}

interface GasReturn {
  async (...restParams: any[]): Promise<any>;
}

interface GasAsyncParam {
  async (...restParams: any[]): Promise<any>;
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

declare function gluer(fn: (data: any, state: any) => any) : GluerReturn;
declare function gluer(initialState: string | number | null | {} | boolean | undefined) : GluerReturn;
declare function gluer(fn: (data: any, state: any) => any, initialState: any) : GluerReturn;
declare function gas(fn: GasAsyncParam) : GasReturn;
declare function gas(fn: GasAsyncParam, GluerReturn) : GasReturn;
export const destruct: Destruct;
