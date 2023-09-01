export interface Options {
  onPopState?: () => any // 导航发生变化，一般是用户点击了系统返回时触发
}

const noop = () => {}

/**
 * 用于阻止用户点击系统返回后阻止页面路由自动回退
 */
class LockNativeBack {
  private isLocked = false
  private url = ''
  public onPopState: () => any

  public constructor(options: Options = {}) {
    this.onPopState = options.onPopState ?? noop
  }

  public lock() {
    if (!this.isLocked) {
      this.isLocked = true
      this.url = window.location.href
      window.history.pushState({}, '', this.url)
      window.addEventListener('popstate', this.handlePopState)
    }

    return () => this.unLock()
  }

  public unLock() {
    if (this.isLocked) {
      this.isLocked = false
      setTimeout(() => {
        window.removeEventListener('popstate', this.handlePopState)
        window.history.go(-1)
      })
    }
  }

  private handlePopState = () => {
    window.history.pushState({}, '', this.url)
    this.onPopState()
  }
}

export default LockNativeBack
