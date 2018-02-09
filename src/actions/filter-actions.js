import * as types from './ActionTypes'

export function changeStagingFilter() {
  return { type: types.CHANGE_STAGING_FILTER }
}
export function changeInvalidItemsFilter() {
  return { type: types.CHANGE_INVALID_ITEMS_FILTER }
}
export function changeCheckedItemsFilter() {
  return { type: types.CHANGE_CHECKED_FILTER }
}
export function viewAllColumns() {
  return { type: types.VIEW_ALL_COLUMNS }
}

export function changeColumnVisibility(field) {
  return { type: types.CHANGE_COLUMN_VISIBILITY, field }
}
