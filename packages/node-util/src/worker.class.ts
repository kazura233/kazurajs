import os from 'os'
import { Worker as _Worker, WorkerOptions as _WorkerOptions } from 'worker_threads'
import { v4 as uuidv4 } from 'uuid'

class NodeWorker extends _Worker {
  public readonly WORKER_ID: string = uuidv4()
  public currentResolve: ((value: any) => void) | null = null
  public currentReject: ((err: Error) => void) | null = null

  public constructor(filename: string | URL, options?: _WorkerOptions) {
    super(filename, options)
  }
}

export interface WorkerOptions extends _WorkerOptions {
  /**
   * 最大并发数 (默认为 CPU 核心数 - 1)
   */
  max?: number
}

export class Worker<Args extends any[], Ret = any> {
  /**
   * 工作线程池
   */
  private pool: NodeWorker[] = []
  /**
   * 空闲的线程
   */
  private idlePool: NodeWorker[] = []
  /**
   * 等待的任务
   */
  private queue: [(worker: NodeWorker) => void, (err: Error) => void][] = []

  public constructor(private filename: string | URL, private options: WorkerOptions = {}) {
    this.options.max = this.options.max ?? Math.max(1, os.cpus().length - 1) // 默认最大并发数为 CPU 核心数 - 1

    if (this.options.max < 1) {
      throw new Error('options.max must be greater than 0')
    }

    this.options.workerData = Object.assign({}, this.options.workerData, {
      WORKER_ID: uuidv4(), // Worker 标识
    })
  }

  public async run(...args: Args): Promise<Ret> {
    const worker = await this.getAvailableWorker()
    return new Promise<Ret>((resolve, reject) => {
      worker.currentResolve = resolve
      worker.currentReject = reject
      worker.postMessage(args)
    })
  }

  /**
   * 停止所有工作线程
   */
  public stop() {
    // 使其不阻止进程退出
    this.pool.forEach((w) => w.unref())
    // 通知所有等待的任务
    this.queue.forEach(([_, reject]) =>
      reject(new Error('Main worker pool stopped before a worker was available.'))
    )
    this.pool = []
    this.idlePool = []
    this.queue = []
  }

  /**
   * 获取可用的工作线程
   * @returns
   */
  private async getAvailableWorker(): Promise<NodeWorker> {
    // 如果有空闲的工作线程，直接分配给它
    if (this.idlePool.length) {
      return this.idlePool.shift()!
    }

    // 如何可以创建新的工作线程
    if (this.pool.length < this.options.max!) {
      const worker = new NodeWorker(this.filename, this.options)

      worker.on('message', (res) => {
        worker.currentResolve && worker.currentResolve(res)
        worker.currentResolve = null
        // 重新分配工作线程
        this.assignDoneWorker(worker)
      })

      worker.on('error', (err) => {
        worker.currentReject && worker.currentReject(err)
        worker.currentReject = null
      })

      worker.on('exit', (code) => {
        const i = this.pool.indexOf(worker)
        // 从池中删除
        if (i > -1) this.pool.splice(i, 1)
        // code !== 0 非正常退出
        if (code !== 0 && worker.currentReject) {
          worker.currentReject(new Error(`Worker stopped with non-0 exit code ${code}`))
          worker.currentReject = null
        }
      })

      // 将工作线程添加到池中
      this.pool.push(worker)
      return worker
    }

    // 没有可用的 worker，需要等待
    let resolve: (worker: NodeWorker) => void
    let reject: (err: Error) => any
    const onWorkerAvailablePromise = new Promise<NodeWorker>((r, rj) => {
      resolve = r
      reject = rj
    })
    this.queue.push([resolve!, reject!])
    return onWorkerAvailablePromise
  }

  /**
   * 分配完成的工作线程
   * @param worker
   * @returns
   */
  private assignDoneWorker(worker: NodeWorker) {
    // 如果有等待的任务，直接分配给它
    if (this.queue.length) {
      const [resolve] = this.queue.shift()!
      resolve(worker)
      return
    }
    // 否则加入空闲池
    this.idlePool.push(worker)
  }
}
