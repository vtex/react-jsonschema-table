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
    table: {
      ...table(state.table, action),
      form: form(state.table.form, action),
    },
    filter: filter(state.filter, action),
  }
}

export default rootReducer
