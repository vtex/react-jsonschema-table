import { PROJECT_NAME } from '../redux/constants'

/** ACTION TYPES **/

const NAME = `${PROJECT_NAME}/table`

export const TABLE_ACTIONS = {
  SHOW_MODAL: `${NAME}/SHOW_MODAL`,
  HIDE_MODAL: `${NAME}/HIDE_MODAL`,
}

/** ACTION CREATORS **/

export function showFormModal(document) {
  return {
    type: TABLE_ACTIONS.SHOW_MODAL,
    payload: {
      showModal: true,
      selectedItem: document,
    },
  }
}

export function hideFormModal() {
  return {
    type: TABLE_ACTIONS.HIDE_MODAL,
    payload: {
      showModal: false,
    },
  }
}

export const actionCreators = {
  showFormModal,
  hideFormModal,
}
