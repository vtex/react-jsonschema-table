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
