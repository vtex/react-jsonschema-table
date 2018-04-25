import items from '../reducers/items-reducer'
import table from '../reducers/table-reducer'
import newTable from 'table/reducer'
import filter from 'toolBar/reducer'

const rootReducer = (state = {}, action) => {
  const { selectionRange, selectionFillHandleRange } = state.table || {}

  return {
    filter: filter(state.filter, action),
    items: items(state.items, {
      ...action,
      selectionRange,
      selectionFillHandleRange,
    }),
    // TODO: Unify reducers
    table:
      Object.keys(state).length > 0
        ? JSON.stringify(state.table) ===
          JSON.stringify(table(state.table, action))
          ? newTable(state.table, action)
          : table(state.table, action)
        : {
          ...newTable(state.table, action),
          ...table(state.table, action),
        },
  }
}

export default rootReducer
