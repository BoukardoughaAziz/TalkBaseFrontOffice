import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// Generated Routes
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { WebSocketProvider } from './context/WebSocketProvider'
import './index.css'
import { routeTree } from './routeTree.gen'
import { persistor, store } from './stores/store'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { store: store },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Create the QueryClient instance 
const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>

    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <WebSocketProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </WebSocketProvider>
      </PersistGate>
    </Provider>

    // </StrictMode>
  )
}
