import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { WebSocketProvider } from './context/WebSocketProvider'
import './index.css'
import { persistor, store } from './stores/store'
import App from './App'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>

    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <WebSocketProvider>
         
              <App></App>
           
          </WebSocketProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>

    // </StrictMode>
  )
}
