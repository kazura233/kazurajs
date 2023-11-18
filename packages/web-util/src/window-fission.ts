import { win } from './add-event-listener'

const KEY = 'WINDOW-FISSION'

/**
 * 每当打开一个新的页面(同浏览器同域)，便会执行一次listener。
 * @param listener
 * @returns
 */
export function windowFission(listener: (event: StorageEvent) => any) {
  window.localStorage.setItem(KEY, Math.random().toString())
  return win(window).addEventListener('storage', (event) => {
    event.key === KEY && listener(event)
  })
}
