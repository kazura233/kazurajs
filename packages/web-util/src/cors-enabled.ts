/**
 * 检查资源是否允许跨域
 * @param url - 要检查的资源 URL
 * @returns - 如果资源允许跨域，返回 true，否则返回 false
 */
export const corsEnabled = (url: string): boolean => {
  const xhr = new XMLHttpRequest()
  xhr.open('HEAD', url, false)

  try {
    xhr.send()
  } catch (e) {
    // 忽略异常
  }

  return xhr.status >= 200 && xhr.status <= 299
}
