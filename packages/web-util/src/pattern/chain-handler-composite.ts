import { ChainHandler, IChainHandler } from './chain-handler'
import { IMiddleware, Middleware as __Middleware } from './middleware'

class Middleware<T> extends __Middleware<T> {
  constructor(protected handleProcess: (data: T) => void) {
    super()
  }
}

export interface IChainHandlerComposite<I, O> extends IChainHandler<I, O> {
  before: IMiddleware<I>
  after: IMiddleware<O>
}

export abstract class ChainHandlerComposite<I, O>
  extends ChainHandler<I, O>
  implements IChainHandlerComposite<I, O>
{
  private beforeMiddleware: IMiddleware<I> = new Middleware<I>((data) => this.execute(data))
  private afterMiddleware: IMiddleware<O> = new Middleware<O>((result) => this.proceed(result))

  public get before(): IMiddleware<I> {
    return this.beforeMiddleware
  }

  public get after(): IMiddleware<O> {
    return this.afterMiddleware
  }

  override execute(data: I) {
    this.beforeMiddleware.execute(data)
  }

  protected override proceed(result: O) {
    this.afterMiddleware.execute(result)
  }
}
