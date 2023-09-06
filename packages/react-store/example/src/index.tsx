import { Root } from '~/Root'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './stores'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <Root />
  </Provider>
)
