export interface Aspect<T> {
  returning?: (result: T) => void
  throwing?: (error: unknown) => void
  before?: () => void
  after?: () => void
}

export type NonPromiseReturnType<T extends (...args: any[]) => any> =
  ReturnType<T> extends Promise<any> ? never : T

export type AspectExecutionFunction = (...args: any[]) => any

export const aspectWrap = <T extends AspectExecutionFunction>(
  fun: NonPromiseReturnType<T>,
  aspect?: Aspect<ReturnType<T>>
) => {
  return (...args: Parameters<T>): void => {
    try {
      if (aspect?.before) aspect.before()
      const result = fun(...args)
      if (aspect?.returning) aspect.returning(result)
    } catch (error) {
      if (aspect?.throwing) aspect.throwing(error)
    } finally {
      if (aspect?.after) aspect.after()
    }
  }
}

export type AspectAsyncExecutionFunction = (...args: any[]) => Promise<any>

export const asyncAspectWrap = <T extends AspectAsyncExecutionFunction>(
  fun: T,
  aspect?: Aspect<ReturnType<T>>
) => {
  return async (...args: Parameters<T>): Promise<void> => {
    try {
      if (aspect?.before) aspect.before()
      const result = await fun(...args)
      if (aspect?.returning) aspect.returning(result)
    } catch (error) {
      if (aspect?.throwing) aspect.throwing(error)
    } finally {
      if (aspect?.after) aspect.after()
    }
  }
}
