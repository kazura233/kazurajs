import { Root } from '~/Root'
import { createRoot } from 'react-dom/client'
import { MobxProvider, createStores } from '@kazura/react-mobx'
import { DemoStore } from './stores/demo-store'

const stores = createStores([DemoStore])

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <MobxProvider stores={stores}>
    <Root />
  </MobxProvider>
)

{
  const win: any = window
  win.DemoStore = DemoStore
  win.stores = stores
}
