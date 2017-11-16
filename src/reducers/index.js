import items from './items-reducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  items,
})

export default rootReducer
