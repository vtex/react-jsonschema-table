import Reflux from 'reflux'
import _ from 'underscore'
import Actions from '../actions/Actions'

var _store = {
  focusedCell: null,
  editingCell: null,
  selectionFillHandleRange: null,
  selectionRange: { cellA: null, cellB: null },
}
// function getStore() {
// return _store
// }
export default Reflux.createStore({
  init: function() {
    this.listenTo(Actions.selectCell, this.onFocusCell)
    this.listenTo(Actions.editCell, this.onEditCell)
    this.listenTo(Actions.exitEditCell, this.onExitEditCell)
    this.listenTo(Actions.cleanSelection, this.onCleanSelection)
    this.listenTo(Actions.clearMassSelection, this.onClearMassSelection)
    this.listenTo(Actions.selectFillHandleCell, this.onSelectFillHandleCell)
    this.listenTo(Actions.selectCellsRange, this.onSelectionRangeChange)
  },
  onFocusCell(cell) {
    if (!_.isEqual(_store.focusedCell, cell)) {
      _store.focusedCell = cell
      _store.selectionRange.cellA = cell
      _store.selectionRange.cellB = cell
      _store.selectionFillHandleRange = null
      _store.editingCell = null
      this.trigger()
    }
  },

  onCleanSelection() {
    _store.focusedCell = null
    _store.editingCell = null
    this.trigger()
  },

  onEditCell(cell) {
    if (!_.isEqual(_store.editingCell, cell)) {
      _store.editingCell = cell
      _store.selectionRange.cellA = cell
      _store.selectionRange.cellB = cell
      this.trigger()
    }
  },
  onExitEditCell(cell) {
    if (_.isEqual(_store.editingCell, cell)) {
      _store.editingCell = null
    }
    this.trigger()
  },

  onSelectionRangeChange(cellA, cellB) {
    _store.selectionRange.cellA = cellA
    _store.selectionRange.cellB = cellB
    _store.selectionFillHandleRange = null
    this.trigger()
  },

  onClearMassSelection() {
    _store.lastSelectedCell = null
    this.trigger()
  },

  onSelectFillHandleCell(cellA, cellB) {
    if (!_store.selectionFillHandleRange) {
      _store.selectionFillHandleRange = {}
    }
    _store.selectionFillHandleRange.cellA = cellA
    _store.selectionFillHandleRange.cellB = cellB
    this.trigger()
  },

  get() {
    return _store
  },
})
