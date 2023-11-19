/**
 * 中间件处理函数类型，接受 IMiddlewareCore<T> 参数并返回 void。
 */
export type MiddlewareHandler<T> = (data: IMiddlewareCore<T>) => void

/**
 * 中间件核心接口，定义了中间件操作的基本结构。
 */
export interface IMiddlewareCore<T> {
  /**
   * 中间件操作的数据对象。
   */
  data: T

  /**
   * 继续执行下一个中间件处理函数。
   */
  next(): void

  /**
   * 中止中间件执行过程。
   */
  abort(): void

  /**
   * 检查中间件是否已被中止。
   */
  isAborted(): boolean
}

/**
 * 中间件核心类，实现了 IMiddlewareCore 接口。
 */
export class MiddlewareCore<T> implements IMiddlewareCore<T> {
  /**
   * 用于表示正无穷大的常量。
   */
  public static readonly INFINITY = Number.POSITIVE_INFINITY

  /**
   * 中间件处理函数的索引。
   */
  private index = -1

  /**
   * 中间件处理函数数组。
   */
  public handlers: Array<MiddlewareHandler<T>>

  /**
   * 中间件操作的数据对象。
   */
  public data: T

  /**
   * 中间件核心类的构造函数。
   * @param data - 中间件操作的初始数据对象。
   * @param handlers - 中间件处理函数数组。
   */
  public constructor(data: T, handlers: Array<MiddlewareHandler<T>>) {
    this.data = data
    this.handlers = handlers
  }

  /**
   * 继续执行下一个中间件处理函数。
   */
  public next() {
    this.index++

    while (this.index < this.handlers.length) {
      const handler = this.handlers[this.index]
      if (handler) {
        handler(this)
        this.index++
      }
    }
  }

  /**
   * 中止中间件执行过程。
   */
  public abort() {
    this.index = MiddlewareCore.INFINITY
  }

  /**
   * 检查中间件是否已被中止。
   */
  public isAborted() {
    return this.index >= MiddlewareCore.INFINITY
  }
}

/**
 * 中间件接口，定义了中间件操作的基本方法。
 */
export interface IMiddleware<T> {
  /**
   * 添加中间件处理函数。
   * @param handler - 要添加的中间件处理函数。
   */
  use(handler: MiddlewareHandler<T>): void

  /**
   * 执行中间件操作。
   * @param data - 中间件操作的数据对象。
   */
  execute(data: T): void
}

/**
 * 中间件抽象类，实现了 IMiddleware 接口，提供了中间件处理的基本结构。
 */
export abstract class Middleware<T> implements IMiddleware<T> {
  /**
   * 中间件处理函数数组。
   */
  public handlers: Array<MiddlewareHandler<T>> = []

  /**
   * 添加中间件处理函数。
   * @param handler - 要添加的中间件处理函数。
   */
  public use(handler: MiddlewareHandler<T>) {
    this.handlers.push(handler)
  }

  /**
   * 执行中间件操作，创建中间件核心实例并调用处理方法。
   * @param data - 中间件操作的数据对象。
   */
  public execute(data: T) {
    const core = new MiddlewareCore(data, this.handlers)
    core.next()
    if (!core.isAborted()) {
      this.handleProcess(core.data)
    }
  }

  /**
   * 抽象方法，处理中间件操作的具体逻辑。
   * @param data - 中间件操作的数据对象。
   */
  protected abstract handleProcess(data: T): void
}
