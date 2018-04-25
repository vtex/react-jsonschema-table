import { TABLE_ACTIONS } from 'table/actions'

const initialState = {
  form: {
    showModal: false,
    selectedItem: {},
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SHOW_MODAL:
    case TABLE_ACTIONS.HIDE_MODAL:
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
