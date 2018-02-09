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

export function exportCheckedItems(id, schema, lang) {
  return { type: types.ADD_ITEM, id, schema, lang }
}

export function checkItem(index) {
  return { type: types.CHECK_ITEM, index }
}

export function saveChanges(context, fields, skip, size, where, sort) {
  return dispatch => {
    const fetcher = GetFetcher()
    dispatch(SaveChangesRequest(context, fields, skip, size, where, sort))
    return fetcher
      .saveChanges(context, fields, skip, size, where, sort)
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
