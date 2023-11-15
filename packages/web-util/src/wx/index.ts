/**
 * 判断是否在微信小程序内
 * @returns
 */
export function isInWeChatMiniProgram() {
  if (navigator.userAgent.toLowerCase().includes('miniprogram')) return true
  return typeof wx !== 'undefined' && wx.miniProgram
}

/**
 * 判断是否在微信浏览器内
 * @returns
 */
export function isInWeChatBrowser() {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}
