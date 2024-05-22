import { Optional } from './Optional'

/**
 * `ContextHolder` 类用来存储和管理一个上下文对象。
 * 提供获取、设置和清除上下文的方法。
 */
export class ContextHolder<T> {
  /**
   * 用于存储上下文对象的变量。
   * 初始值为 `null`。
   */
  private contextHolder: T | null = null

  /**
   * 返回一个包含当前上下文对象的 `Optional`。
   * 如果上下文对象为空，返回一个空的 `Optional`。
   *
   * @returns 一个包含当前上下文对象的 `Optional`
   */
  public getContext(): Optional<T> {
    return Optional.ofNullable(this.contextHolder)
  }

  /**
   * 设置上下文对象。
   *
   * @param context - 要设置的上下文对象
   */
  public setContext(context: T): void {
    this.contextHolder = context
  }

  /**
   * 清除当前的上下文对象，将其重置为 `null`。
   */
  public clearContext(): void {
    this.contextHolder = null
  }
}
