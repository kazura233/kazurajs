export interface ProxyMeta {
  referer: string
}

export interface IProxy {
  proxyList: Array<{
    proxyUrl: string
    iframe: HTMLIFrameElement
    receiver: Window
  }>
  postMessage(channelName: string, data: any): void
  destroy(): void
  meta(): ProxyMeta
}

export class BroadcastProxy implements IProxy {
  public static readonly MESSAGE_TAG: string = 'application/x-web-broadcast-proxy-v1'

  public readonly proxyList: Array<{
    proxyUrl: string
    iframe: HTMLIFrameElement
    receiver: Window
  }> = []

  public constructor(proxy: string | string[]) {
    const list = Array.isArray(proxy) ? proxy : [proxy]
    list.forEach((proxyUrl) => {
      const iframe = this.createIFrame(proxyUrl)
      const receiver = iframe.contentWindow!
      this.proxyList.push({
        proxyUrl,
        iframe,
        receiver,
      })
    })
  }

  private createIFrame(url: string) {
    const iframe = document.createElement('iframe')
    iframe.className = 'BroadcastProxyIFrame'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.src = url
    return iframe
  }

  public postMessage(channelName: string, data: any) {
    this.proxyList.forEach(({ receiver }) => {
      receiver.postMessage(
        {
          tag: BroadcastProxy.MESSAGE_TAG,
          channelName,
          data,
        },
        '*'
      )
    })
  }

  public destroy() {
    this.proxyList.forEach(({ iframe }) => {
      iframe.parentNode!.removeChild(iframe)
    })
  }

  public meta(): ProxyMeta {
    return {
      referer: window.location.href,
    }
  }
}
