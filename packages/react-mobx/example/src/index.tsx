import { Root } from '~/Root'
import { createRoot } from 'react-dom/client'
import { MobxProvider } from '@kazura/react-mobx'
import { DemoStore } from './stores/demo-store'

const stores = [DemoStore]

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <MobxProvider stores={stores}>
    <Root />
  </MobxProvider>
)
