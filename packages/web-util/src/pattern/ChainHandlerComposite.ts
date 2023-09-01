import { ChainHandler, IChainHandler } from './ChainHandler'
import { IMiddleware, Middleware as __Middleware } from './Middleware'

class Middleware<T> extends __Middleware<T> {
  public constructor(protected handleProcess: (data: T) => void) {
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
  protected superExecute = (data: I) => super.execute(data)
  protected superProceed = (result: O) => super.proceed(result)

  public before: IMiddleware<I> = new Middleware<I>(this.superExecute)
  public after: IMiddleware<O> = new Middleware<O>(this.superProceed)

  public override execute(data: I) {
    this.before.execute(data)
  }

  protected override proceed(result: O) {
    this.after.execute(result)
  }
}
