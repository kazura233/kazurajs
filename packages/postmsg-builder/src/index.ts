import WebPostMsg, { Listener, PostMsgAPIOptions } from '@kazura/web-postmsg'

export interface ParentIFrameReceiverOptions {
  container: HTMLElement
  className?: string
  url?: string
}

export interface ParentOpenerReceiverOptions {
  url: string
  features?: string
}

export default class PostMsgBuilder {
  public iframe?: HTMLIFrameElement

  public options: Required<PostMsgAPIOptions> = {
    listeners: new Map<string, Listener>(),
    receiver: window,
    channel: WebPostMsg.generateUUID(),
    receiveAllChannel: false,
  }

  public constructor(options?: Partial<PostMsgAPIOptions>) {
    if (options) this.options = { ...this.options, ...options }
  }

  /**
   * 设置渠道
   * @param channel
   * @returns
   */
  private setChannel(channel: string) {
    this.options.channel = channel
  }

  /**
   * 设置接收者
   * @param receiver
   * @returns
   */
  public setReceiver(receiver: Window) {
    // 如果记录中的iframe的contentWindow不是receiver，那么就清空iframe
    if (this.iframe && this.iframe.contentWindow !== receiver) {
      this.iframe = undefined
    }

    this.options.receiver = receiver

    return this
  }

  /**
   * 设置 iframe 接收者
   * @param iframe
   * @returns
   */
  public setIFrameReceiver(iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.setReceiver(iframe.contentWindow!)
    return this
  }

  /**
   * 批量设置监听器
   * @param listeners
   * @returns
   */
  public setListeners(listeners: Map<string, Listener>) {
    this.options.listeners = listeners
    return this
  }

  /**
   * 设置监听器
   * @param type
   * @param listener
   * @returns
   */
  public setListener(type: string, listener: Listener) {
    this.options.listeners.set(type, listener)
    return this
  }

  /**
   * 删除监听器
   * @param type
   * @returns
   */
  public deleteListener(type: string) {
    this.options.listeners.delete(type)
    return this
  }

  /**
   * 设置接收全部渠道消息
   * @param receiveAllChannel
   * @returns
   */
  public setReceiveAllChannel(receiveAllChannel: boolean) {
    this.options.receiveAllChannel = receiveAllChannel
    return this
  }

  /**
   * 编译生成WebPostMsg对象
   * @returns
   */
  public build() {
    return new WebPostMsg(this.options)
  }

  /**
   * 创建 Child iframe 接收者
   * @param iframe
   */
  public createChildIFrameReceiver(iframe: HTMLIFrameElement): PostMsgBuilder
  public createChildIFrameReceiver(options: ParentIFrameReceiverOptions): PostMsgBuilder
  public createChildIFrameReceiver(
    $1: HTMLIFrameElement | ParentIFrameReceiverOptions
  ): PostMsgBuilder {
    if ($1 instanceof HTMLIFrameElement) {
      const iframe = $1

      if (iframe.name) {
        this.setChannel(iframe.name)
      } else {
        throw new Error('createChildIFrameReceiver: iframe.name is empty')
      }

      this.setIFrameReceiver(iframe)
      return this
    }

    if ($1.container) {
      const options = $1
      const iframe = document.createElement('iframe')

      iframe.name = this.options.channel
      if (options.className) iframe.className = options.className
      options.container.appendChild(iframe)

      this.setIFrameReceiver(iframe)
      if (options.url) this.loadURL(options.url)

      return this
    }

    throw new Error('createChildIFrameReceiver: invalid arguments')
  }

  /**
   * 控制 iframe 加载页面
   * @param url
   * @returns
   */
  public loadURL(url: string) {
    if (this.iframe) this.iframe.src = url
    return this
  }

  /**
   * 创建 Parent iframe 接收者
   * @returns
   */
  public createParentIFrameReceiver() {
    this.setReceiver(window.parent)
    this.setChannel(window.name)
    return this
  }

  /**
   * 创建 Child opener 接收者
   * @param receiver
   */
  public createChildOpenerReceiver(receiver: Window, name: string): PostMsgBuilder
  public createChildOpenerReceiver(options: ParentOpenerReceiverOptions): PostMsgBuilder
  public createChildOpenerReceiver(
    $1: Window | ParentOpenerReceiverOptions,
    $2?: string
  ): PostMsgBuilder {
    if (typeof $1 === 'object') {
      if ('opener' in $1) {
        this.setReceiver($1)
        if ($2) {
          this.setChannel($2)
          return this
        }

        throw new Error('createChildOpenerReceiver: name is empty')
      }

      if ($1.url) {
        const options = $1
        this.open(options.url, options.features)
        return this
      }
    }

    throw new Error('createChildOpenerReceiver: invalid arguments')
  }

  /**
   * 打开一个新窗口，并设置为接收者
   * @param url
   * @param features
   * @returns
   */
  public open(url: string, features?: string) {
    this.setReceiver(window.open(url, this.options.channel, features)!)
    return this
  }

  /**
   * 创建 Parent opener 接收者
   * @returns
   */
  public createParentOpenerReceiver() {
    this.setReceiver(window.opener)
    this.setChannel(window.name)
    return this
  }

  /**
   * 析构方法
   * @returns
   */
  public destroy() {
    if (this.iframe) {
      this.iframe.parentNode!.removeChild(this.iframe)
    } else {
      this.options.receiver.close()
    }
    return this
  }
}
