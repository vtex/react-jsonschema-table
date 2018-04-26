import items from '../reducers/items-reducer'
import table from 'table/reducer'
import filter from 'toolBar/reducer'

const rootReducer = (state = {}, action) => {
  const { selectionRange, selectionFillHandleRange } = state.table || {}

  return {
    filter: filter(state.filter, action),
    table: table(state.table, action),
    items: items(state.items, {
      ...action,
      selectionRange,
      selectionFillHandleRange,
    }),
  }
}

export default rootReducer
