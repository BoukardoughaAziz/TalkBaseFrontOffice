import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Provider } from 'react-redux'
// Generated Routes
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import { routeTree } from './routeTree.gen'
import { store, persistor } from './stores/store'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { store: store },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

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
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    // </StrictMode>    
  )
}
