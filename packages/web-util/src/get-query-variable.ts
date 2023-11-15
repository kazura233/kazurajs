/**
 * 通过参数名获取url中的参数值
 * @param paramName
 * @param search
 */
export const getQueryVariable = (paramName: string, search?: string): string => {
  paramName = encodeURIComponent(paramName)
  search = search || location.search

  search = search.substring(search.indexOf('?') + 1)

  if (typeof URLSearchParams === 'function') {
    const paramValue = new URLSearchParams(search).get(paramName)
    return paramValue ? decodeURIComponent(paramValue) : ''
  }

  const reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i')
  const match = search.match(reg)

  return match ? decodeURIComponent(match[2]) : ''
}
