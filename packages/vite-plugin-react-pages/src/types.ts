export interface Options {
  caseSensitive?: boolean
}

export interface ResolvedOptions extends Required<Options> {
  root: string
}
