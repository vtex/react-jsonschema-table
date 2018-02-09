import * as types from './ActionTypes'

export function editCell(cell) {
  return { type: types.EDIT_CELL, cell }
}

export function selectCell(cell) {
  return { type: types.SELECT_CELL, cell }
}

export function exitEditCell(cell) {
  return { type: types.EXIT_EDIT_CELL, cell }
}

export function selectCellsRange(cellA, cellB) {
  return { type: types.SELECT_CELLS_RANGE, cellA, cellB }
}

export function selectFillHandleRange(cellA, cellB) {
  return { type: types.SELECT_FILLHANDLE_CELLS_RANGE, cellA, cellB }
}
