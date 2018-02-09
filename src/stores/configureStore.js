import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'
import logger from 'redux-logger'

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, logger),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  // if (module.hot) {
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers/index.js').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }
  return store
}

export default configureStore()
