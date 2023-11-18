import { Win } from './add-event-listener'

const WINDOW_FISSION_KEY = '@kazura/web-util~window-fission__v1'

/**
 * 每当打开一个新的页面(同浏览器同域)，便会执行一次 listener。
 * @param listener - 要执行的监听器函数
 * @returns - 可以取消监听的函数
 */
export function windowFission(listener: (event: StorageEvent) => any): () => void {
  window.localStorage.setItem(WINDOW_FISSION_KEY, Math.random().toString())
  return Win.addEventListener('storage', (event) => {
    if (event.key === WINDOW_FISSION_KEY) {
      listener(event)
    }
  })
}
