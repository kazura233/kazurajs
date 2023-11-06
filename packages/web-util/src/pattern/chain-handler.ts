export interface IChainHandler<IN, OUT> {
  setSucessor(sucessor: IChainHandler<OUT, any>): void
  execute(data: IN): void
}

export abstract class ChainHandler<IN, OUT> implements IChainHandler<IN, OUT> {
  protected sucessor?: ChainHandler<OUT, any>

  public setSucessor(sucessor: ChainHandler<OUT, any>) {
    this.sucessor = sucessor
  }

  public execute(data: IN) {
    const result = this.handleProcess(data)
    if (result instanceof Promise) {
      result.then((_) => this.proceed(_))
    } else {
      this.proceed(result)
    }
  }

  protected proceed(result: OUT) {
    if (this.sucessor) {
      this.sucessor.execute(result)
    }
  }

  protected abstract handleProcess(data: IN): OUT | Promise<OUT>
}
