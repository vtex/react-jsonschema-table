import { TABLE_ACTIONS } from 'table/actions'

const initialState = {
  focusedCell: null,
  editingCell: null,
  selectionFillHandleRange: { cellA: null, cellB: null },
  selectionRange: { cellA: null, cellB: null },
  form: {
    showModal: false,
    selectedItem: {},
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SELECT_CELL: {
      return {
        ...state,
        focusedCell: action.payload.cell,
        selectionRange: {
          cellA: action.payload.cell,
          cellB: action.payload.cell
        },
        selectionFillHandleRange: {
          cellA: null,
          cellB: null
        },
        editingCell: null,
      }
    }

    case TABLE_ACTIONS.EDIT_CELL: {
      return {
        ...state,
        selectionRange: {
          cellA: action.payload.cell,
          cellB: action.payload.cell,
        },
        editingCell: cell,
      }
    }

    case TABLE_ACTIONS.EXIT_EDIT_CELL: {
      return { // test: for me exit editing should always set null...
        ...state,
        editingCell:
          JSON.stringify(action.payload.cell) === JSON.stringify(state.editingCell)
          ? null
          : state.editingCell,
      }
    }

    case TABLE_ACTIONS.CLEAN_SELECTION: {
      return {
        ...state,
        focusedCell: null,
        editingCell: null,
      }
    }

    case TABLE_ACTIONS.SELECT_CELLS_RANGE: {
      return {
        ...state,
        selectionRange: {
          cellA: action.payload.cellA,
          cellB: action.payload.cellB
        },
        selectionFillHandleRange: {
          cellA: null,
          cellB: null
        },
      }
    }

    case TABLE_ACTIONS.SELECT_FILLHANDLE_CELLS_RANGE: {
      const { cellA, cellB } = action
      return {
        ...state,
        selectionFillHandleRange: {
          cellA: action.payload.cellA,
          cellB: action.payload.cellB
        },
      }
    }

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
