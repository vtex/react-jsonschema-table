import Reflux from 'reflux'
import _ from 'underscore'
import Actions from '../actions/Actions'

class RowsStore extends Reflux.Store {
  constructor() {
    super()
    this.state = {
      focusedCell: null,
      editingCell: null,
      lastSelectedCell: null,
      selectionFillHandleRange: null,
      selectionRange: { cellA: null, cellB: null },
    }
    this.listenTo(Actions.selectCell, this.onFocusCell)
    this.listenTo(Actions.editCell, this.onEditCell)
    this.listenTo(Actions.exitEditCell, this.onExitEditCell)
    this.listenTo(Actions.cleanSelection, this.onCleanSelection)
    this.listenTo(Actions.clearMassSelection, this.onClearMassSelection)
    this.listenTo(Actions.selectFillHandleCell, this.onSelectFillHandleCell)
    this.listenTo(Actions.selectCellsRange, this.onSelectionRangeChange)
  }

  onFocusCell(cell) {
    if (!_.isEqual(this.state.focusedCell, cell)) {
      this.setState({
        focusedCell: cell,
        selectionRange: { cellA: cell, cellB: cell },
        selectionFillHandleRange: null,
        editingCell: null,
      })
    }
  }

  onCleanSelection() {
    this.setState({
      focusedCell: null,
      editingCell: null,
    })
  }

  onEditCell(cell) {
    if (!_.isEqual(this.state.editingCell, cell)) {
      this.setState({
        selectionRange: { cellA: cell, cellB: cell },
        editingCell: cell,
      })
    }
  }
  onExitEditCell(cell) {
    if (_.isEqual(this.state.editingCell, cell)) {
      this.setState({
        editingCell: null,
      })
    }
    this.trigger()
  }

  onSelectionRangeChange(cellA, cellB) {
    this.setState({
      selectionRange: { cellA: cellA, cellB: cellB },
      selectionFillHandleRange: null,
    })
    this.trigger()
  }

  onClearMassSelection() {
    this.setState({
      lastSelectedCell: null,
    })
    this.trigger()
  }

  onSelectFillHandleCell(cellA, cellB) {
    if (!this.state.selectionFillHandleRange) {
      this.state.selectionFillHandleRange = {}
    }
    this.setState({
      selectionRange: { cellA: cellA, cellB: cellB },
    })
    this.trigger()
  }

  get() {
    return this.state
  }
}

export default RowsStore
