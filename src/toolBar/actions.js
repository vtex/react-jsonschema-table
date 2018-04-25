import { PROJECT_NAME } from '../redux/constants'

/** ACTION TYPES **/

const NAME = `${PROJECT_NAME}/toolBar`

export const TOOLBAR_ACTIONS = {
  TOGGLE_STAGING_FILTER: `${NAME}/TOGGLE_STAGING_FILTER`,
  TOGGLE_INVALID_ITEMS_FILTER: `${NAME}/TOGGLE_INVALID_ITEMS_FILTER`,
  TOGGLE_CHECKED_FILTER: `${NAME}/TOGGLE_CHECKED_FILTER`,
  CHANGE_COLUMN_VISIBILITY: `${NAME}/CHANGE_COLUMN_VISIBILITY`,
  SHOW_ALL_COLUMNS: `${NAME}/SHOW_ALL_COLUMNS`,
  CANCEL_STAGING: `${NAME}/CANCEL_STAGING`,
}

/** ACTION CREATORS **/

export function toggleStagingFilter() { // former changeStagingFilter
  return {
    type: TOOLBAR_ACTIONS.TOGGLE_STAGING_FILTER,
    payload: {},
  }
}

export function toggleInvalidItemsFilter() { // former changeInvalidItemsFilter
  return {
    type: TOOLBAR_ACTIONS.TOGGLE_INVALID_ITEMS_FILTER,
    payload: {},
  }
}

export function toggleCheckedItemsFilter() { // former changeCheckedItemsFilter
  return {
    type: TOOLBAR_ACTIONS.TOGGLE_CHECKED_FILTER,
    payload: {},
  }
}

export function changeColumnVisibility(field, visible) {
  return {
    type: TOOLBAR_ACTIONS.CHANGE_COLUMN_VISIBILITY,
    payload: {
      field,
      visible,
    },
  }
}

export function showAllColumns() { // former viewAllColumns
  return {
    type: TOOLBAR_ACTIONS.SHOW_ALL_COLUMNS,
    payload: {},
  }
}

export function cancelStaging() {
  return {
    type: TOOLBAR_ACTIONS.CANCEL_STAGING,
    payload: {},
  }
}

export const actionCreators = {
  toggleStagingFilter,
  toggleInvalidItemsFilter,
  toggleCheckedItemsFilter,
  changeColumnVisibility,
  showAllColumns,
  cancelStaging,
}