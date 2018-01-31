import * as types from '../actions/ActionTypes'

const initialState = {
  focusedCell: null,
  editingCell: null,
  selectionFillHandleRange: { cellA: null, cellB: null },
  selectionRange: { cellA: null, cellB: null },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SELECT_CELL: {
      const { cell } = action
      return Object.assign({}, state, {
        focusedCell: cell,
        selectionRange: { cellA: cell, cellB: cell },
        selectionFillHandleRange: { cellA: null, cellB: null },
        editingCell: null,
      })
    }
    case types.CLEAN_SELECTION: {
      return Object.assign({}, state, {
        focusedCell: null,
        editingCell: null,
      })
    }

    case types.EDIT_CELL: {
      const { cell } = action
      return Object.assign({}, state, {
        selectionRange: { cellA: cell, cellB: cell },
        editingCell: cell,
      })
    }

    case types.EXIT_EDIT_CELL: {
      if (action.cell === state.editingCell) {
        return Object.assign({}, state, {
          editingCell: null,
        })
      }
      return state
    }

    case types.SELECT_CELLS_RANGE: {
      const { cellA, cellB } = action
      return Object.assign({}, state, {
        selectionRange: { cellA: cellA, cellB: cellB },
        selectionFillHandleRange: { cellA: null, cellB: null },
      })
    }

    case types.SELECT_FILLHANDLE_CELL: {
      const { cellA, cellB } = action
      return Object.assign({}, state, {
        selectionFillHandleRange: { cellA: cellA, cellB: cellB },
      })
    }
    default:
      return state
  }
}
