import { MobxMap } from './mobx-map.class'

export type IStores = MobxMap

export interface MobxProviderProps {
  children: React.ReactNode
  stores: IStores
}
