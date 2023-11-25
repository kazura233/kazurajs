/**
 * 判断是否在浏览器环境中
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 获取用户代理字符串（User Agent）
 */
export const userAgent = isBrowser ? window.navigator.userAgent.toLowerCase() : ''

/**
 * 判断是否为IE浏览器
 */
export const isIE = isBrowser && /msie|trident/.test(userAgent)

/**
 * 判断是否为IE 9
 */
export const isIE9 = isBrowser && userAgent.includes('msie 9.0')

/**
 * 判断是否为Edge浏览器
 */
export const isEdge = isBrowser && userAgent.includes('edge/')

/**
 * 判断是否为Android设备
 */
export const isAndroid = isBrowser && userAgent.includes('android')

/**
 * 判断是否为iOS设备
 */
export const isIOS = isBrowser && /iphone|ipad|ipod|ios/.test(userAgent)

/**
 * 判断是否为Chrome浏览器（不包括Edge）
 */
export const isChrome = isBrowser && /chrome\/\d+/.test(userAgent) && !isEdge

/**
 * 判断是否为PhantomJS浏览器
 */
export const isPhantomJS = isBrowser && userAgent.includes('phantomjs')

/**
 * 判断是否为Firefox浏览器，并获取版本号
 */
export const isFirefox = isBrowser && userAgent.match(/firefox\/(\d+)/) !== null

/**
 * 判断一个函数是否为 JavaScript 的内置函数
 * @param {any} Ctor - 要检查的函数。
 * @returns {boolean} - 如果函数是本地代码，则返回 true；否则返回 false。
 */
export function isNative(Ctor: any): boolean {
  if (typeof Ctor === 'function') {
    return /native code/.test(Ctor.toString())
  }
  return false
}

export function noop(..._: any[]): any {}
