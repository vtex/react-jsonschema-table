/** ACTION TYPES **/

const NAME = `RJST/modal`

export const FORM_ACTIONS = {
  SHOW_MODAL: `${NAME}/SHOW_MODAL`,
  HIDE_MODAL: `${NAME}/HIDE_MODAL`,
}

/** ACTION CREATORS **/

export function showFormModal(document) {
  return {
    type: FORM_ACTIONS.SHOW_MODAL,
    payload: {
      showModal: true,
      selectedItem: document,
    },
  }
}

export function hideFormModal() {
  return {
    type: FORM_ACTIONS.HIDE_MODAL,
    payload: {
      showModal: false,
    },
  }
}

export const actionCreators = {
  showFormModal,
  hideFormModal,
}