export interface Options {
  /**
   * 是否区分大小写
   */
  caseSensitive?: boolean

  /**
   * 需要扫描的目录
   */
  dirs?: string[]

  /**
   * 需要忽略的目录
   */
  exclude?: string[]

  /**
   * 需要扫描的文件扩展名
   */
  extensions?: string[]
}

export interface ResolvedOptions extends Required<Options> {
  root: string
}
