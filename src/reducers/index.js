import items from './items-reducer'
import table from './table-reducer'
import filter from './filter-reducer'

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  items,
  table,
  filter,
})

export default rootReducer
