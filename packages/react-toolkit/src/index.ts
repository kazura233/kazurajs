import type {
  FC,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  FunctionComponent,
  MemoExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react'

import { memo, forwardRef } from 'react'

export * from './dom'

export interface IFunctionComponentOptions<P = {}> extends FunctionComponent<P> {
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
): MemoExoticComponent<FC<P>> | FC<P> {
  render.propTypes = options?.propTypes
  render.displayName = options?.displayName
  if (options?.memo) return memo(render)
  return render
}

export interface IForwardRefRenderFunctionOptions<P> extends ForwardRefExoticComponent<P> {}

export function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>,
  options?: IForwardRefRenderFunctionOptions<PropsWithoutRef<P> & RefAttributes<T>>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const component = forwardRef<T, P>(render)
  component.propTypes = options?.propTypes
  component.displayName = options?.displayName
  return component
}
