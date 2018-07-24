interface Glue {
  [index:string]: any;
}

interface CreateGlueFnc<T> {
  <T>(module: T, defaultValue?: T): T;
}
declare const createGlue: CreateGlueFnc<Glue>;

declare const gluePair