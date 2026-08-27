import axios from 'axios'
import type { HttpInstance, HttpRequestConfig, HttpResponse, HttpStatic } from './types'

export * from './types'

export default class HttpClient {
  public static readonly http: HttpStatic = axios
  public static readonly HttpStatusCode = HttpClient.http.HttpStatusCode
  public static readonly HttpHeaders = HttpClient.http.AxiosHeaders
  public static readonly HttpError = HttpClient.http.AxiosError
  public static readonly isHttpError = HttpClient.http.isAxiosError
  public static readonly toFormData = HttpClient.http.toFormData
  public static readonly formToJSON = HttpClient.http.formToJSON

  private instance: HttpInstance

  private config: HttpRequestConfig

  public constructor(config: HttpRequestConfig = {}) {
    this.config = config
    this.instance = HttpClient.http.create(this.config)
  }

  public get interceptors() {
    return this.instance.interceptors
  }

  public request<T = any, D = any, R = HttpResponse<T, D>>(
    config: HttpRequestConfig<D>,
  ): Promise<R> {
    return this.instance.request<T, R, D>(config)
  }

  public mergeConfig(config: HttpRequestConfig) {
    this.config = HttpClient.mergeConfig(this.config, config)
    const { request, response } = this.instance.interceptors
    this.instance = HttpClient.http.create(this.config)
    this.instance.interceptors.request = request
    this.instance.interceptors.response = response
  }

  public exportHttpInstance() {
    return this.instance
  }

  public static create(config?: HttpRequestConfig) {
    return new HttpClient(config)
  }

  public static mergeConfig(
    config1: HttpRequestConfig,
    config2: HttpRequestConfig,
  ): HttpRequestConfig {
    return HttpClient.http.mergeConfig(config1, config2)
  }
}
