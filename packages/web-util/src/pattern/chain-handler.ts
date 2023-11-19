/**
 * 链式处理器接口，定义了处理器的基本结构。
 * @template IN - 输入类型。
 * @template OUT - 输出类型。
 */
export interface IChainHandler<IN, OUT> {
  /**
   * 设置后继处理器。
   * @param successor - 后继处理器。
   */
  setSuccessor(successor: IChainHandler<OUT, any>): void

  /**
   * 执行处理操作。
   * @param data - 输入数据。
   */
  execute(data: IN): void
}

/**
 * 抽象链式处理器类，实现了 IChainHandler 接口。
 * @template IN - 输入类型。
 * @template OUT - 输出类型。
 */
export abstract class ChainHandler<IN, OUT> implements IChainHandler<IN, OUT> {
  /**
   * 后继处理器。
   */
  protected successor?: ChainHandler<OUT, any>

  /**
   * 设置后继处理器。
   * @param successor - 后继处理器。
   */
  public setSuccessor(successor: ChainHandler<OUT, any>) {
    this.successor = successor
  }

  /**
   * 执行处理操作，处理器返回的结果可以是同步值或 Promise。
   * @param data - 输入数据。
   */
  public execute(data: IN) {
    Promise.resolve(this.handleProcess(data)).then((result) => {
      this.proceed(result)
    })
  }

  /**
   * 后继处理方法，将结果传递给后继处理器。
   * @param result - 处理结果。
   */
  protected proceed(result: OUT) {
    if (this.successor) {
      this.successor.execute(result)
    }
  }

  /**
   * 抽象方法，处理输入数据并返回处理结果。
   * @param data - 输入数据。
   * @returns 处理结果。
   */
  protected abstract handleProcess(data: IN): OUT | Promise<OUT>
}
