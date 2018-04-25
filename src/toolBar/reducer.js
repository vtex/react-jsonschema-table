import { TOOLBAR_ACTIONS } from './actions'

const initialState = {
  isSelectedFilterActive: false,
  isStagingFilterActive: false,
  isInvalidFilterActive: false,
  hiddenFields: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOOLBAR_ACTIONS.CHANGE_COLUMN_VISIBILITY:
      const { field, visible } = action.payload
      return {
        ...state,
        hiddenFields: visible
          ? state.hiddenFields.filter(_field => _field !== field)
          : [ ...state.hiddenFields, field ]
      }
    case TOOLBAR_ACTIONS.VIEW_ALL_COLUMNS:
      return {
        ...state,
        hiddenFields: [],
      }
    case TOOLBAR_ACTIONS.CANCEL_STAGING:
      return {
        ...state,
        isSelectedFilterActive: false,
        isStagingFilterActive: false,
        isInvalidFilterActive: false,
      }
    case TOOLBAR_ACTIONS.TOGGLE_CHECKED_FILTER:
      const chackToggled = !state.isSelectedFilterActive
      return {
        ...state,
        isSelectedFilterActive: chackToggled,
        isStagingFilterActive: chackToggled ? state.isStagingFilterActive : chackToggled,
        isInvalidFilterActive: chackToggled ? state.isInvalidFilterActive : chackToggled,
      }
    case TOOLBAR_ACTIONS.TOGGLE_STAGING_FILTER:
      const stagingToggled = !state.isStagingFilterActive
      return {
        ...state,
        isSelectedFilterActive: stagingToggled ? state.isSelectedFilterActive : stagingToggled,
        isStagingFilterActive: stagingToggled,
        isInvalidFilterActive: stagingToggled ? state.isInvalidFilterActive : stagingToggled,
      }
    case TOOLBAR_ACTIONS.TOGGLE_INVALID_ITEMS_FILTER:
      const invalidToggled = !state.isInvalidFilterActive
      return {
        ...state,
        isSelectedFilterActive: invalidToggled ? state.isSelectedFilterActive : invalidToggled,
        isStagingFilterActive: invalidToggled ? state.isStagingFilterActive : invalidToggled,
        isInvalidFilterActive: invalidToggled,
      }
    default:
      return state
  }
}
