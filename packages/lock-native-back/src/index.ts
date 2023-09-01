export interface Options {
  onPopState?: Function
}

const noop = () => {}

class LockNativeBack {
  private isLocked = false
  private url = ''
  public onPopState: Function

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
