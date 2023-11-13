export class BlinkTitle {
  /**
   * 透明像素的1x1 PNG图片
   */
  public static readonly transparentPixel =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

  /**
   * 原始标题
   */
  public originalTitle = document.title

  /**
   * 自定义文本1
   * @example '【新消息】'
   */
  public customText1 = ''

  /**
   * 自定义文本2
   * @example '【　　　】'
   */
  public customText2 = ''

  public iconLinks: Array<{
    dom: HTMLLinkElement
    href: string
  }> = []

  /**
   * 是否闪烁图标
   */
  public iconBlink = false

  /**
   * 定时器
   */
  public timer: number | null = null
  public autoCloseDelayTimer: number | null = null

  /**
   * 构造函数
   * @param customText1 交替显示的文本1 例子：'【新消息】'
   * @param customText2 交替显示的文本2 例子：'【　　　】'
   * @param iconBlink 是否闪烁图标
   */
  public constructor(customText1: string, customText2: string, iconBlink = false) {
    this.customText1 = customText1
    this.customText2 = customText2
    this.iconBlink = iconBlink
    document
      .querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
      .forEach((dom) => this.iconLinks.push({ dom, href: dom.getAttribute('href') || '' }))
  }

  /**
   * 开始闪烁
   * @param interval 闪烁间隔
   * @param autoCloseDelay 自动关闭
   * @returns 返回一个函数，调用该函数可以停止闪烁
   */
  public startBlinking(interval: number, autoCloseDelay: number = 5000) {
    if (this.timer) this.stopBlinking()
    if (this.autoCloseDelayTimer) window.clearTimeout(this.autoCloseDelayTimer)

    let tag = true

    this.timer = window.setInterval(() => {
      // 闪烁标题
      document.title = (tag ? this.customText1 : this.customText2) + this.originalTitle
      // 闪烁图标
      if (this.iconBlink)
        tag ? this.restoreAllIconHrefs() : this.setAllIconHrefs(BlinkTitle.transparentPixel)

      tag = !tag
    }, interval)

    const stop = () => this.stopBlinking()
    this.autoCloseDelayTimer = window.setTimeout(stop, autoCloseDelay)

    return stop
  }

  /**
   * 停止闪烁
   */
  public stopBlinking() {
    if (this.timer) {
      clearInterval(this.timer)
      document.title = this.originalTitle
      this.restoreAllIconHrefs()
    }
  }

  /**
   * 设置所有图标的href
   * @param href
   */
  public setAllIconHrefs(href: string) {
    this.iconLinks.forEach(({ dom }) => (dom.href = href))
  }

  /**
   * 恢复所有图标的href
   */
  public restoreAllIconHrefs() {
    this.iconLinks.forEach(({ dom, href }) => (dom.href = href))
  }
}
