import items from './items-reducer'
import table from './table-reducer'
import filter from './filter-reducer'
import form from './form-reducer'

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
    form: form(state.table.form, action),
  }
}

export default rootReducer
