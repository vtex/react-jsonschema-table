import items from '../reducers/items-reducer'
import table from '../reducers/table-reducer'
import filter from 'toolBar/reducer'
import form from 'table/reducer'

const rootReducer = (state = {}, action) => {
  const { selectionRange, selectionFillHandleRange } = state.table || {}
  return {
    items: items(state.items, {
      ...action,
      selectionRange,
      selectionFillHandleRange,
    }),
    table: table(state.table, action),
    filter: filter(state.filter, action),
    form: form(state.form, action),
  }
}

export default rootReducer
