import { random } from '@kazura/web-util'
import { ProxyMeta, IProxy, BroadcastProxy } from './broadcast-proxy'

export interface MessageData<T = any> {
  tag: typeof WebBroadcast.MESSAGE_TAG
  type: string
  resources: T
  receiver: string
  sender: string
  uuid: string
  proxy?: ProxyMeta
}

export type Listener = (resources: any, event: MessageEvent<MessageData>) => void

export interface IBroadcastAPI {
  PUBLIC_CHANNEL: string
  publicBroadcast: BroadcastChannel
  PRIVATE_CHANNEL: string
  privateBroadcast: BroadcastChannel
  postPublicMessage(type: string, resources: any): void
  postPrivateMessage(type: string, resources: any, to: string): void
  generateMessage(type: string, resources: any, to?: string): MessageData
  on(type: string, listener: Listener): void
  off(type: string, listener?: Listener): void
  destroy(): void
}

export interface BroadcastAPIOptions {
  listeners?: Map<string, Listener[]>
  listenSelf?: boolean
  channel?: string
  proxy?: string | string[]
}

export default class WebBroadcast implements IBroadcastAPI {
  /**
   * 消息标签
   */
  public static readonly MESSAGE_TAG: string = 'application/x-web-broadcast-v1'

  /**
   * 渠道名称前戳
   */
  public static readonly PREFIX_CHANNEL: string = 'web-broadcast@v1__'

  /**
   * 唯一序号
   */
  public readonly uuid: string = WebBroadcast.generateUUID()

  /**
   * 公有渠道的名称
   */
  public readonly PUBLIC_CHANNEL: string

  /**
   * 公有广播
   */
  public readonly publicBroadcast: BroadcastChannel

  /**
   * 私有渠道的名称
   */
  public readonly PRIVATE_CHANNEL: string = WebBroadcast.PREFIX_CHANNEL + this.uuid

  /**
   * 私有广播
   */
  public readonly privateBroadcast: BroadcastChannel = new BroadcastChannel(this.PRIVATE_CHANNEL)

  /**
   * 自身广播
   */
  public readonly fissionBroadcast?: BroadcastChannel

  /**
   * 其他广播缓存池
   */
  public broadcastPool: Map<string, BroadcastChannel> = new Map()

  /**
   * 监听函数集合
   */
  private listeners: Map<string, Listener[]> = new Map()

  public proxy?: IProxy

  public constructor(options?: BroadcastAPIOptions) {
    if (!options) options = {}

    if (options.listeners) this.listeners = options.listeners

    // 初始化公有广播
    this.PUBLIC_CHANNEL = WebBroadcast.PREFIX_CHANNEL + (options.channel ?? 'default-channel')
    this.publicBroadcast = new BroadcastChannel(this.PUBLIC_CHANNEL)
    this.publicBroadcast.addEventListener('message', this.eventHandler)

    // 初始化私有广播
    this.privateBroadcast.addEventListener('message', this.eventHandler)

    // 初始化自身广播
    if (options.listenSelf) {
      this.fissionBroadcast = new BroadcastChannel(this.PUBLIC_CHANNEL)
      this.fissionBroadcast.addEventListener('message', this.fissionHandler)
    }

    // 初始化代理
    if (options.proxy) {
      this.proxy = new BroadcastProxy(options.proxy)
    }
  }

  /**
   * 往公有渠道发送一条消息
   * @param message
   */
  public postPublicMessage(type: string, resources: any) {
    const message = this.generateMessage(type, resources)
    this.publicBroadcast.postMessage(message)

    if (this.proxy) {
      this.proxy.postMessage(message.receiver, message)
    }

    return message
  }

  /**
   * 往私有渠道发送一条消息
   * @param message
   */
  public postPrivateMessage(type: string, resources: any, to: string) {
    let broadcast = this.broadcastPool.get(to)
    if (!broadcast) {
      broadcast = new BroadcastChannel(to)
      this.broadcastPool.set(to, broadcast)
    }

    const message = this.generateMessage(type, resources, to)
    broadcast.postMessage(message)

    if (this.proxy) {
      this.proxy.postMessage(message.receiver, message)
    }

    return message
  }

  /**
   * 生成一个随机的id
   * @returns
   */
  public static generateUUID() {
    return '' + random(10000, 99999) + new Date().getTime()
  }

  public generateUUID() {
    return WebBroadcast.generateUUID()
  }

  /**
   * 生成一条消息
   * @param type
   * @param resources
   * @param replyMessageId
   * @returns
   */
  public generateMessage(type: string, resources: any, to?: string): MessageData {
    return {
      tag: WebBroadcast.MESSAGE_TAG,
      type,
      resources,
      receiver: to ?? this.PUBLIC_CHANNEL,
      sender: this.PRIVATE_CHANNEL,
      uuid: WebBroadcast.generateUUID(),
      proxy: this.proxy?.meta(),
    }
  }

  /**
   * 事件处理
   * @param event
   * @returns
   */
  private eventHandler = (event: MessageEvent<MessageData>) => {
    const { data } = event
    this.checkMessage(data) && this.callListeners(event)
  }

  /**
   * 事件处理
   * @param event
   * @returns
   */
  private fissionHandler = (event: MessageEvent<MessageData>) => {
    const { data } = event
    this.checkMessage(data) && data.sender === this.PRIVATE_CHANNEL && this.callListeners(event)
  }

  private checkMessage(msg: MessageData) {
    if (typeof msg === 'object' && 'tag' in msg && msg.tag === WebBroadcast.MESSAGE_TAG) {
      if (msg.receiver === this.PUBLIC_CHANNEL || msg.receiver === this.PRIVATE_CHANNEL) {
        return true
      }
    }
    return false
  }

  private callListeners(event: MessageEvent<MessageData>) {
    const { data } = event
    const listener = this.listeners.get(data.type)
    listener && listener.forEach((fn) => fn(data.resources, event))
  }

  /**
   * 注册一个监听函数
   * @param type
   * @param listener
   */
  public on(type: string, listener: Listener) {
    const listeners: Listener[] = this.listeners.get(type) || []
    this.listeners.set(type, listeners.concat(listener))
  }

  /**
   * 移除一个监听函数
   * @param type
   * @param listener
   */
  public off(type: string, listener?: Listener) {
    if (listener) {
      const listeners: Listener[] = this.listeners.get(type) || []
      this.listeners.set(
        type,
        listeners.filter((l) => l !== listener)
      )
    } else {
      this.listeners.delete(type)
    }
  }

  /**
   * 析构方法，移除所有副作用。
   */
  public destroy() {
    this.publicBroadcast.close()
    this.privateBroadcast.close()
    this.fissionBroadcast?.close()
    this.broadcastPool.forEach((_) => _.close())
    this.proxy?.destroy()
  }
}
