// Adjust the path as necessary
import { createStore } from 'redux'
// default is localStorage
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

// Create store
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware()) // Optional: for Redux DevTools
)
export type RootState = ReturnType<typeof store.getState>;  // <== Add this line

const persistor = persistStore(store)
export { persistor, store }

