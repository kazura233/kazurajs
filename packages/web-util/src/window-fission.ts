import { Win } from './add-event-listener'

const KEY = '@kazura/web-util~window-fission__v1'

/**
 * 每当打开一个新的页面(同浏览器同域)，便会执行一次listener。
 * @param listener
 * @returns
 */
export function windowFission(listener: (event: StorageEvent) => any) {
  window.localStorage.setItem(KEY, Math.random().toString())
  return Win.addEventListener('storage', (event) => {
    event.key === KEY && listener(event)
  })
}
