import * as types from './ActionTypes'
import { GetFetcher } from './FetcherWrapper'

const fetchItemsRequest = () => ({
  type: types.ITEMS_LOAD_BEGAN,
})

const fetchItemsSucess = (items, totalRows, rowStart, sort, where) => ({
  type: types.ITEMS_LOAD_SUCCESS,
  items: items,
  totalRows: totalRows,
  rowStart: rowStart,
  sort: sort,
  where: where,
})

const fetchItemsFailure = error => ({
  type: types.ITEMS_LOAD_FAIL,
  error: error,
})

const SaveChangesRequest = () => ({
  type: types.ITEMS_LOAD_BEGAN,
})

const saveChangesSucess = (items, totalRows, rowStart, sort, where) => ({
  type: types.ITEMS_LOAD_SUCCESS,
  items: items,
  totalRows: totalRows,
  rowStart: rowStart,
  sort: sort,
  where: where,
})

const saveChangesFailure = error => ({
  type: types.ITEMS_LOAD_FAIL,
  error: error,
})

export function addItem(id, schema, lang) {
  return { type: types.ADD_ITEM, id, schema, lang }
}

export function removeItem(index, schema, lang) {
  return { type: types.REMOVE_ITEM, index, schema, lang }
}

export function updateItem(id, schema, changes, lang) {
  return { type: types.UPDATE_ITEM, id, schema, changes, lang }
}

export function exportCheckedItems(fields, entityId) {
  return {
    type: types.EXPORT_CHECKED_ITEMS,
    payload: {
      fields,
      entityId,
    },
  }
}

export function checkItemChange(id, checked) {
  return { type: types.CHECK_ITEM_CHANGE, id, checked }
}

export function saveChanges(context, schema) {
  return (dispatch, getState) => {
    const items = getState().items.staging
    const fetcher = GetFetcher()
    dispatch(SaveChangesRequest(items, context, schema))
    return fetcher
      .saveChanges(items, context, schema)
      .then(response =>
        dispatch(
          saveChangesSucess(
            response.items,
            response.totalRows,
            response.rowStart,
            sort,
            where
          )
        )
      )
      .catch(ex => dispatch(saveChangesFailure(ex)))
  }
}

export function discardChanges() {
  return { type: types.CANCEL_STAGING }
}

export function undo(schema, lang) {
  return { type: types.UNDO_CHANGE, schema, lang }
}
export function redo(schema, lang) {
  return { type: types.REDO_CHANGE, schema, lang }
}

export function deleteCheckedItems() {
  return { type: types.DELETE_CHECKED_ITEMS }
}

export function fetchItems(context, fields, skip, size, where, sort) {
  return dispatch => {
    const fetcher = GetFetcher()
    dispatch(fetchItemsRequest(context, fields, skip, size, where, sort))
    return fetcher
      .getItems(context, fields, skip, size, where, sort)
      .then(response =>
        dispatch(
          fetchItemsSucess(
            response.items,
            response.totalRows,
            response.rowStart,
            sort,
            where
          )
        )
      )
      .catch(ex => dispatch(fetchItemsFailure(ex)))
  }
}

export function preLoadItems(items) {
  const loadedItems = items.filter(i => i.status === 'loaded' && i.document !== null)
  return fetchItemsSucess(
    loadedItems,
    loadedItems.length,
    0,
  )
}

export function copyFromSelectedRange(changes, schema, lang) {
  return { type: types.COPY_FROM_SELECTED_RANGE, changes, schema, lang }
}

export function receiveItemsFromProps(items) {
  return {
    type: types.RECEIVE_ITEMS_FROM_PROPS,
    payload: {
      items,
    }
  }
}
