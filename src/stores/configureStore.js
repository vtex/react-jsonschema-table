import { createStore, compose, applyMiddleware } from 'redux'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'
import logger from 'redux-logger'

export default initialState => {
  // const persistConfig = {
  //   key: 'RJST',
  //   storage,
  // }

  // const persistedReducer = persistReducer(persistConfig, rootReducer)
  const hasDevTools = typeof window !== 'undefined' && window.devToolsExtension
  const store = createStore(
    rootReducer,
    initialState,
    hasDevTools
    ? compose(
      // applyMiddleware(thunk, logger),
      applyMiddleware(logger),
      window.devToolsExtension()
    )
    : applyMiddleware(logger)
  )

  // const persistor = persistStore(store)

  // if (module.hot) {
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers/index.js').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }
  return { store }
  // return { store, persistor }
}
