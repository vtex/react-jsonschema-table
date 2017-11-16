import * as types from './ActionTypes'
import { GetFetcher } from './FetcherWrapper'

export const fetchItemsRequest = () => ({
  type: types.ITEMS_LOAD_BEGAN,
})

export const fetchItemsSucess = items => ({
  type: types.ITEMS_LOAD_SUCCESS,
  items: items,
})

export const fetchItemsFailure = error => ({
  type: types.ITEMS_LOAD_FAIL,
  error: error,
})

export const fetchItems = () => (
  context,
  fields,
  skip,
  size,
  where,
  sort
) => dispatch => {
  const fetcher = GetFetcher()
  dispatch.fetchItemsRequest(context, fields, skip, size, where, sort)
  return fetcher
    .getItems(context, fields, skip, size, where, sort)
    .then(json => dispatch(fetchItemsSucess(json.body)))
    .catch(ex => dispatch(fetchItemsFailure(ex)))
}
