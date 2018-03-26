import reducer from '../table-reducer'
import * as types from '../../actions/ActionTypes'

describe('Table Reducer', () => {
  it('WHEN unkown action is passed THEN must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      focusedCell: null,
      editingCell: null,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: null, cellB: null },
    })
  })
  it('WHEN SELECT_CELL action THEN the focusedCell and the selectionRange must be cell passed by the Action', () => {
    const cell = { row: 1, col: 1 }
    expect(
      reducer(
        {
          focusedCell: null,
          editingCell: null,
          selectionFillHandleRange: 0,
          selectionRange: { cellA: null, cellB: null },
        },
        { type: types.SELECT_CELL, cell: cell }
      )
    ).toEqual({
      focusedCell: cell,
      editingCell: null,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: cell, cellB: cell },
    })
  })
  it('WHEN CLEAN_SELECTION action THEN the focusedCell and the editingCell must be null', () => {
    const cell = { row: 1, col: 1 }
    expect(
      reducer(
        {
          focusedCell: cell,
          editingCell: cell,
          selectionFillHandleRange: { cellA: null, cellB: null },
          selectionRange: { cellA: cell, cellB: cell },
        },
        { type: types.CLEAN_SELECTION, cell: cell }
      )
    ).toEqual({
      focusedCell: null,
      editingCell: null,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: cell, cellB: cell },
    })
  })
  it('WHEN EDIT_CELL action THEN the focusedCell and the editingCell must be the cell passed as parameter', () => {
    const cell = { row: 1, col: 1 }
    expect(
      reducer(
        {
          focusedCell: cell,
          editingCell: null,
          selectionFillHandleRange: { cellA: null, cellB: null },
          selectionRange: { cellA: cell, cellB: cell },
        },
        { type: types.EDIT_CELL, cell: cell }
      )
    ).toEqual({
      focusedCell: cell,
      editingCell: cell,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: cell, cellB: cell },
    })
  })

  it('WHEN EXIT_EDIT_CELL action THEN the editingCell must be null', () => {
    const cell = { row: 1, col: 1 }
    expect(
      reducer(
        {
          focusedCell: cell,
          editingCell: cell,
          selectionFillHandleRange: { cellA: null, cellB: null },
          selectionRange: { cellA: cell, cellB: cell },
        },
        { type: types.EXIT_EDIT_CELL, cell: cell }
      )
    ).toEqual({
      focusedCell: cell,
      editingCell: null,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: cell, cellB: cell },
    })
  })

  it('WHEN SELECT_CELLS_RANGE action THEN the editingCell must be the cells passed as parameter', () => {
    const cellA = { row: 1, col: 1 }
    const cellB = { row: 2, col: 1 }
    expect(
      reducer(
        {
          focusedCell: cellA,
          editingCell: null,
          selectionFillHandleRange: { cellA: null, cellB: null },
          selectionRange: { cellA: cellA, cellB: cellA },
        },
        { type: types.SELECT_CELLS_RANGE, cellA: cellA, cellB: cellB }
      )
    ).toEqual({
      focusedCell: cellA,
      editingCell: null,
      selectionFillHandleRange: { cellA: null, cellB: null },
      selectionRange: { cellA: cellA, cellB: cellB },
    })
  })

  it('WHEN SELECT_FILLHANDLE_CELL action THEN the editingCell must be null', () => {
    const cellA = { row: 1, col: 1 }
    const cellB = { row: 2, col: 1 }
    expect(
      reducer(
        {
          focusedCell: cellA,
          editingCell: null,
          selectionFillHandleRange: { cellA: null, cellB: null },
          selectionRange: { cellA: cellA, cellB: cellA },
        },
        { type: types.SELECT_FILLHANDLE_CELL, cellA: cellA, cellB: cellB }
      )
    ).toEqual({
      focusedCell: cellA,
      editingCell: null,
      selectionFillHandleRange: { cellA: cellA, cellB: cellB },
      selectionRange: { cellA: cellA, cellB: cellA },
    })
  })
})
