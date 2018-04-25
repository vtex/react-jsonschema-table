import { FORM_ACTIONS } from 'table/actions'

const initialState = {
  showModal: false,
  selectedItem: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_ACTIONS.SHOW_MODAL:
    case FORM_ACTIONS.HIDE_MODAL:
      return {
        ...state,
        showModal: action.payload.showModal,
        selectedItem: action.payload.selectedItem || {},
      }
    default:
      return state
  }
}
