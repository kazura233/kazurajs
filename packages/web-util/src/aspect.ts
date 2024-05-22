/**
 * 定义了一个切面（Aspect）接口，用于在函数执行的不同阶段添加自定义逻辑。
 *
 * @typeparam T - 函数的返回值类型
 */
export interface Aspect<T> {
  /**
   * 在函数成功返回后调用。
   *
   * @param result - 函数的返回结果
   */
  returning?: (result: T) => void
  /**
   * 在函数抛出异常时调用。
   *
   * @param error - 抛出的异常
   */
  throwing?: (error: unknown) => void
  /**
   * 在函数执行前调用。
   */
  before?: () => void
  /**
   * 在函数执行后调用（无论成功与否）。
   */
  after?: () => void
}

/**
 * 获取一个函数的返回值类型，如果返回值是 Promise 则为 never。
 *
 * @typeparam T - 函数类型
 */
export type NonPromiseReturnType<T extends (...args: any[]) => any> =
  ReturnType<T> extends Promise<any> ? never : T

/**
 * 定义了一个通用的函数类型。
 */
export type AspectExecutionFunction = (...args: any[]) => any

/**
 * 同步函数的切面包装器，用于在函数执行的不同阶段添加切面逻辑。
 *
 * @typeparam T - 函数类型
 * @param fun - 要包装的函数
 * @param aspect - 切面对象，定义在函数执行前、成功后、抛出异常时和执行后要执行的逻辑
 * @returns 包装后的函数
 */
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

/**
 * 定义了一个返回 Promise 的异步函数类型。
 */
export type AspectAsyncExecutionFunction = (...args: any[]) => Promise<any>

/**
 * 异步函数的切面包装器，用于在异步函数执行的不同阶段添加切面逻辑。
 *
 * @typeparam T - 异步函数类型
 * @param fun - 要包装的异步函数
 * @param aspect - 切面对象，定义在函数执行前、成功后、抛出异常时和执行后要执行的逻辑
 * @returns 包装后的异步函数
 */
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
