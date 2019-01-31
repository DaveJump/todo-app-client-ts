export interface Obj {
  [index: string]: any
}

export interface FetchParams {
  [index: string]: any,
  data?: Obj,
  params?: Obj,
  options?: Obj
}
