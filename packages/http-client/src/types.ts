import type {
  AxiosStatic,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export interface HttpStatic extends AxiosStatic {}
export interface HttpInstance extends AxiosInstance {}
export interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D> {}
export interface CreateHttpDefaults<D = any> extends CreateAxiosDefaults<D> {}
export interface HttpResponse<T = any, D = any> extends AxiosResponse<T, D> {}

export interface InternalHttpRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {}
