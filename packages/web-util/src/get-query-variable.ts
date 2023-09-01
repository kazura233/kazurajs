/**
 * 通过参数名获取url中的参数值
 * @param queryName
 */
export const getQueryVariable = (queryName: string, search?: string): string => {
  queryName = encodeURIComponent(queryName)
  search = search || location.search
  search = search.substring(search.indexOf('?') + 1)
  if (typeof URLSearchParams === 'function') {
    return decodeURIComponent(new URLSearchParams(search).get(queryName) || '')
  }
  const reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  const res = search.match(reg)
  return res ? decodeURIComponent(res[2]) : ''
}
