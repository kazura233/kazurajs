import { parentPort, workerData } from 'worker_threads'

/**
 * 任务工作者
 *
 * @example
 * ```typescript
 * class Demo extends TaskWorker<[number, number], number> {
 *  public async doWork(a: number, b: number): Promise<number> {
 *   return a + b
 * }
 *
 * new Demo()
 *
 * ```
 *
 */
export abstract class TaskWorker<Args extends any[], Ret = any> {
  public readonly workerData = workerData

  constructor() {
    parentPort!.on('message', async (args: Args) => {
      const result = await this.doWork(...args)
      parentPort!.postMessage(result)
    })
  }

  abstract doWork(...args: Args): Ret | Promise<Ret>
}
