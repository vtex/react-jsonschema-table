import { FORM_ACTIONS } from 'table/actions'

const initialState = {
  form: {
    showModal: false,
    selectedItem: {},
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_ACTIONS.SHOW_MODAL:
    case FORM_ACTIONS.HIDE_MODAL:
      return {
        ...state,
        form: {
          selectedItem: action.payload.selectedItem || {},
          showModal: action.payload.showModal,
        },
      }

    default:
      return state
  }
}
