import type {
  FC,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  MemoExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  ValidationMap,
  WeakValidationMap,
} from 'react'

import { memo, forwardRef } from 'react'

export interface IFunctionComponentOptions<P> {
  propTypes?: WeakValidationMap<P> | undefined
  contextTypes?: ValidationMap<any> | undefined
  defaultProps?: Partial<P> | undefined
  displayName?: string | undefined
  memo?: boolean | undefined
}

export function defineFunctionComponent<P = {}>(
  render: FC<P>,
  options: IFunctionComponentOptions<P> & { memo: true }
): MemoExoticComponent<FC<P>>
export function defineFunctionComponent<P = {}>(
  render: FC<P>,
  options?: IFunctionComponentOptions<P> & { memo?: false | undefined }
): FC<P>
export function defineFunctionComponent<P = {}>(
  render: FC<P>,
  options?: IFunctionComponentOptions<P>
) {
  render.propTypes = options?.propTypes
  render.contextTypes = options?.contextTypes
  render.defaultProps = options?.defaultProps
  render.displayName = options?.displayName
  if (options?.memo) return memo(render)
  return render
}

export interface IForwardRefRenderFunction<P> {
  propTypes?: WeakValidationMap<P> | undefined
  defaultProps?: Partial<P> | undefined
  displayName?: string | undefined
  memo?: boolean | undefined
}

export function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, P>,
  options: IForwardRefRenderFunction<PropsWithoutRef<P> & RefAttributes<T>> & { memo: true }
): MemoExoticComponent<ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>>
export function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, P>,
  options?: IForwardRefRenderFunction<PropsWithoutRef<P> & RefAttributes<T>> & {
    memo?: false | undefined
  }
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>
export function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, P>,
  options?: IForwardRefRenderFunction<PropsWithoutRef<P> & RefAttributes<T>>
) {
  const component = forwardRef<T, P>(render)
  component.propTypes = options?.propTypes
  component.defaultProps = options?.defaultProps
  component.displayName = options?.displayName
  if (options?.memo) return memo(render)
  return component
}
