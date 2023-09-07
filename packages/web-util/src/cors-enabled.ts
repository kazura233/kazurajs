/**
 * 检查资源是否允许跨域
 * @param url
 * @returns
 */
export const corsEnabled = (url: string): boolean => {
  const xhr = new XMLHttpRequest()
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}
