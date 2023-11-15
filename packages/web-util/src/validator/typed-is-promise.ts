// https://github.com/TylorS/typed-is-promise

export function isPromise<T>(p: any): p is Promise<T>
export function isPromise(p: any): p is Promise<any>

export function isPromise<T>(p: any): p is Promise<T> {
  return p !== null && typeof p === 'object' && typeof p.then === 'function'
}
