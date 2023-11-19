import { ChainHandler, IChainHandler } from './chain-handler'
import { IMiddleware, Middleware as __Middleware } from './middleware'

/**
 * 中间件类，继承自基础 Middleware 类。
 * @template T - 中间件操作的数据类型。
 */
class Middleware<T> extends __Middleware<T> {
  /**
   * 构造函数，接受一个处理数据的回调函数。
   * @param handleProcess - 处理数据的回调函数。
   */
  constructor(protected handleProcess: (data: T) => void) {
    super()
  }
}

/**
 * 链式处理器组合接口，扩展自 IChainHandler 接口。
 * @template I - 输入类型。
 * @template O - 输出类型。
 */
export interface IChainHandlerComposite<I, O> extends IChainHandler<I, O> {
  /**
   * 前置中间件。
   */
  before: IMiddleware<I>

  /**
   * 后置中间件。
   */
  after: IMiddleware<O>
}

/**
 * 抽象链式处理器组合类，继承自 ChainHandler 类，实现了 IChainHandlerComposite 接口。
 * @template I - 输入类型。
 * @template O - 输出类型。
 */
export abstract class ChainHandlerComposite<I, O>
  extends ChainHandler<I, O>
  implements IChainHandlerComposite<I, O>
{
  /**
   * 前置中间件实例。
   */
  private beforeMiddleware: IMiddleware<I> = new Middleware<I>((data) => this.execute(data))

  /**
   * 后置中间件实例。
   */
  private afterMiddleware: IMiddleware<O> = new Middleware<O>((result) => this.proceed(result))

  /**
   * 获取前置中间件。
   */
  public get before(): IMiddleware<I> {
    return this.beforeMiddleware
  }

  /**
   * 获取后置中间件。
   */
  public get after(): IMiddleware<O> {
    return this.afterMiddleware
  }

  /**
   * 重写执行方法，调用前置中间件的执行。
   * @param data - 输入数据。
   */
  override execute(data: I) {
    this.beforeMiddleware.execute(data)
  }

  /**
   * 重写后继处理方法，调用后置中间件的执行。
   * @param result - 处理结果。
   */
  protected override proceed(result: O) {
    this.afterMiddleware.execute(result)
  }
}
