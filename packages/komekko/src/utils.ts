export function getpkg(id = '') {
  const s = id.split('/')
  return s[0][0] === '@' ? `${s[0]}/${s[1]}` : s[0]
}

export function arrayIncludes(arr: (string | RegExp)[], searchElement: string) {
  return arr.some((entry) =>
    entry instanceof RegExp ? entry.test(searchElement) : entry === searchElement,
  )
}

export function removeExtension(filename: string) {
  return filename.replace(/\.(d\.mts|d\.cts|d\.ts|js|mjs|cjs|ts|mts|cts|json|jsx|tsx)$/, '')
}
