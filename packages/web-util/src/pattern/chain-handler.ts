export interface IChainHandler<IN, OUT> {
  setSuccessor(successor: IChainHandler<OUT, any>): void
  execute(data: IN): void
}

export abstract class ChainHandler<IN, OUT> implements IChainHandler<IN, OUT> {
  protected successor?: ChainHandler<OUT, any>

  public setSuccessor(successor: ChainHandler<OUT, any>) {
    this.successor = successor
  }

  public execute(data: IN) {
    Promise.resolve(this.handleProcess(data)).then((result) => {
      this.proceed(result)
    })
  }

  protected proceed(result: OUT) {
    if (this.successor) {
      this.successor.execute(result)
    }
  }

  protected abstract handleProcess(data: IN): OUT | Promise<OUT>
}
