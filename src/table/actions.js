import { PROJECT_NAME } from '../redux/constants'

/** ACTION TYPES **/

const NAME = `${PROJECT_NAME}/table`

export const TABLE_ACTIONS = {
  SELECT_CELL: `${NAME}/SELECT_CELL`,
  EDIT_CELL: `${NAME}/EDIT_CELL`,
  EXIT_EDIT_CELL: `${NAME}/EXIT_EDIT_CELL`,
  CLEAN_SELECTION: `${NAME}/CLEAN_SELECTION`,
  SELECT_CELLS_RANGE: `${NAME}/SELECT_CELLS_RANGE`,
  SELECT_FILLHANDLE_CELLS_RANGE: `${NAME}/SELECT_FILLHANDLE_CELLS_RANGE`,
  SHOW_MODAL: `${NAME}/form/SHOW_MODAL`,
  HIDE_MODAL: `${NAME}/form/HIDE_MODAL`,
}

/** ACTION CREATORS **/

export function selectCell(cell) {
  return {
    type: TABLE_ACTIONS.SELECT_CELL,
    payload: {
      cell,
    }
  }
}

export function editCell(cell) {
  return {
    type: TABLE_ACTIONS.EDIT_CELL,
    payload: {
      cell,
    }
  }
}

export function exitEditCell(cell) {
  return {
    type: TABLE_ACTIONS.EXIT_EDIT_CELL,
    payload: {
      cell,
    },
  }
}

export function cleanSelection() {
  return {
    type: TABLE_ACTIONS.CLEAN_SELECTION,
    payload: {},
  }
}

export function selectCellsRange(cellA, cellB) {
  return {
    type: TABLE_ACTIONS.SELECT_CELLS_RANGE,
    payload: {
      cellA,
      cellB
    }
  }
}

export function selectFillHandleRange(cellA, cellB) {
  return {
    type: TABLE_ACTIONS.SELECT_FILLHANDLE_CELLS_RANGE,
    payload: {
      cellA,
      cellB
    }
  }
}

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
  selectCell,
  editCell,
  exitEditCell,
  cleanSelection,
  selectCellsRange,
  selectFillHandleRange,
  showFormModal,
  hideFormModal,
}
