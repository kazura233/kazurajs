/**
 * Ping 函数的配置选项
 */
export interface PingOptions {
  /** 超时时间（毫秒），默认 5000ms */
  timeout?: number
  /** 请求方法，默认 'HEAD' */
  method?: 'GET' | 'HEAD' | 'POST'
  /** 请求头 */
  headers?: Record<string, string>
}

/**
 * Ping 结果
 */
export interface PingResult {
  /** 是否成功 */
  success: boolean
  /** 响应时间（毫秒） */
  responseTime: number
  /** 状态码 */
  status?: number
  /** 错误信息 */
  error?: string
}

/**
 * 使用 fetch 实现的 ping 函数
 * @param url 要 ping 的 URL
 * @param options 配置选项
 * @returns Promise<PingResult>
 */
export async function ping(url: string, options: PingOptions = {}): Promise<PingResult> {
  const { timeout = 5000, method = 'HEAD', headers = {} } = options

  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      method,
      headers,
      signal: controller.signal,
      mode: 'cors',
      cache: 'no-cache',
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    return {
      success: response.ok,
      responseTime,
      status: response.status,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * 简化版 ping 函数，只返回是否可达
 * @param url 要 ping 的 URL
 * @param timeout 超时时间（毫秒），默认 5000ms
 * @param method 请求方法，默认 'HEAD'
 * @returns Promise<boolean>
 */
export async function isReachable(
  url: string,
  timeout: number = 5000,
  method: 'GET' | 'HEAD' | 'POST' = 'HEAD'
): Promise<boolean> {
  const result = await ping(url, { timeout, method })
  return result.success
}
