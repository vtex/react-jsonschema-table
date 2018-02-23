import * as types from '../actions/ActionTypes'

const initialState = {
  isSelectedFilterActive: false,
  isStagingFilterActive: false,
  isInvalidFilterActive: false,
  hiddenFields: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_COLUMN_VISIBILITY: {
      const { field, visible } = action
      const newState = Object.assign({}, state)

      if (visible) {
        newState.hiddenFields = newState.hiddenFields.filter(
          hiddenField => hiddenField !== field
        )
      } else {
        if (!newState.hiddenFields.includes(field)) {
          newState.hiddenFields.push(field)
        }
      }
      return newState
    }

    case types.VIEW_ALL_COLUMNS: {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.errors,
      })
    }

    case types.CANCEL_STAGING: {
      const newState = Object.assign({}, state)
      newState.isSelectedFilterActive = false
      newState.isStagingFilterActive = false
      newState.isInvalidFilterActive = false
      return newState
    }

    case types.CHANGE_CHECKED_FILTER: {
      const newState = Object.assign({}, state)
      newState.isSelectedFilterActive = !state.isSelectedFilterActive
      newState.isStagingFilterActive = newState.isSelectedFilterActive
        ? false
        : newState.isStagingFilterActive
      newState.isInvalidFilterActive = newState.isSelectedFilterActive
        ? false
        : newState.isInvalidFilterActive
      return newState
    }

    case types.CHANGE_STAGING_FILTER: {
      const newState = Object.assign({}, state)
      newState.isStagingFilterActive = !state.isStagingFilterActive
      newState.isSelectedFilterActive = newState.isStagingFilterActive
        ? false
        : newState.isSelectedFilterActive
      newState.isInvalidFilterActive = newState.isStagingFilterActive
        ? false
        : newState.isInvalidFilterActive
      return newState
    }

    case types.CHANGE_INVALID_ITEMS_FILTER: {
      const newState = Object.assign({}, state)
      newState.isInvalidFilterActive = !state.isInvalidFilterActive
      newState.isStagingFilterActive = newState.isInvalidFilterActive
        ? false
        : newState.isStagingFilterActive
      newState.isSelectedFilterActive = newState.isInvalidFilterActive
        ? false
        : newState.isSelectedFilterActive
      return newState
    }

    default:
      return state
  }
}
