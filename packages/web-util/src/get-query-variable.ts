/**
 * 通过参数名获取 URL 中的参数值。
 * @param paramName - 要获取的参数名。
 * @param search - 可选参数，用于指定 URL 查询部分，不提供时使用当前页面的 location.search。
 * @returns 参数值，如果不存在则返回空字符串。
 */
export const getQueryVariable = (paramName: string, search?: string): string => {
  // 对参数名进行编码，确保匹配时不受特殊字符影响。
  paramName = encodeURIComponent(paramName)

  // 如果未提供 search 参数，则使用当前页面的查询部分。
  search = search || location.search

  // 从查询部分中移除问号。
  search = search.substring(search.indexOf('?') + 1)

  // 使用 URLSearchParams 获取参数值（适用于现代浏览器）。
  if (typeof URLSearchParams === 'function') {
    const paramValue = new URLSearchParams(search).get(paramName)
    return paramValue ? decodeURIComponent(paramValue) : ''
  }

  // 使用正则表达式匹配参数值（兼容性处理）。
  const reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i')
  const match = search.match(reg)

  // 返回匹配的参数值，如果不存在则返回空字符串。
  return match ? decodeURIComponent(match[2]) : ''
}
