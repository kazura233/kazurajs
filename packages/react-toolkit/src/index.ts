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
  /**
   * Used to declare the types of the props accepted by the
   * component. These types will be checked during rendering
   * and in development only.
   *
   * We recommend using TypeScript instead of checking prop
   * types at runtime.
   *
   * @see {@link https://react.dev/reference/react/Component#static-proptypes React Docs}
   */
  propTypes?: WeakValidationMap<P> | undefined
  /**
   * @deprecated
   *
   * Lets you specify which legacy context is consumed by
   * this component.
   *
   * @see {@link https://legacy.reactjs.org/docs/legacy-context.html Legacy React Docs}
   */
  contextTypes?: ValidationMap<any> | undefined
  /**
   * Used to define default values for the props accepted by
   * the component.
   *
   * @see {@link https://react.dev/reference/react/Component#static-defaultprops React Docs}
   *
   * @example
   *
   * ```tsx
   * type Props = { name?: string }
   *
   * const MyComponent: FC<Props> = (props) => {
   *   return <div>{props.name}</div>
   * }
   *
   * MyComponent.defaultProps = {
   *   name: 'John Doe'
   * }
   * ```
   */
  defaultProps?: Partial<P> | undefined
  /**
   * Used in debugging messages. You might want to set it
   * explicitly if you want to display a different name for
   * debugging purposes.
   *
   * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
   *
   * @example
   *
   * ```tsx
   *
   * const MyComponent: FC = () => {
   *   return <div>Hello!</div>
   * }
   *
   * MyComponent.displayName = 'MyAwesomeComponent'
   * ```
   */
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
): MemoExoticComponent<FC<P>> | FC<P> {
  render.propTypes = options?.propTypes
  render.contextTypes = options?.contextTypes
  render.defaultProps = options?.defaultProps
  render.displayName = options?.displayName
  if (options?.memo) return memo(render)
  return render
}

export interface IForwardRefRenderFunctionOptions<P> {
  /**
   * Used to declare the types of the props accepted by the
   * component. These types will be checked during rendering
   * and in development only.
   *
   * We recommend using TypeScript instead of checking prop
   * types at runtime.
   *
   * @see {@link https://react.dev/reference/react/Component#static-proptypes React Docs}
   */
  propTypes?: WeakValidationMap<P> | undefined
  /**
   * Used to define default values for the props accepted by
   * the component.
   *
   * @see {@link https://react.dev/reference/react/Component#static-defaultprops React Docs}
   *
   * @example
   *
   * ```tsx
   * type Props = { name?: string }
   *
   * const MyComponent: FC<Props> = (props) => {
   *   return <div>{props.name}</div>
   * }
   *
   * MyComponent.defaultProps = {
   *   name: 'John Doe'
   * }
   * ```
   */
  defaultProps?: Partial<P> | undefined
  /**
   * Used in debugging messages. You might want to set it
   * explicitly if you want to display a different name for
   * debugging purposes.
   *
   * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
   *
   * @example
   *
   * ```tsx
   *
   * const MyComponent: FC = () => {
   *   return <div>Hello!</div>
   * }
   *
   * MyComponent.displayName = 'MyAwesomeComponent'
   * ```
   */
  displayName?: string | undefined
}

export function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>,
  options?: IForwardRefRenderFunctionOptions<PropsWithoutRef<P> & RefAttributes<T>>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const component = forwardRef<T, P>(render)
  component.propTypes = options?.propTypes
  component.defaultProps = options?.defaultProps
  component.displayName = options?.displayName
  return component
}
