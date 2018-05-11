import React from 'react'
import ReactDom from 'react-dom'
import _ from 'underscore'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'
import Cell from './Cell.react'

class Row extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isHoveringIndexCell: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.columns !== nextProps.columns) return true
    if (this.state.isHoveringIndexCell !== nextState.isHoveringIndexCell) return true
    if (
      (nextProps.focusedCell &&
        this.props.item.virtualID === nextProps.focusedCell.row) ||
      (this.props.focusedCell &&
        this.props.item.virtualID === this.props.focusedCell.row)
    ) {
      return true
    }
    if (
      (nextProps.selectionRange &&
        nextProps.selectionRange.cellA &&
        nextProps.selectionRange.cellB &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          nextProps.selectionRange.cellA.row,
          nextProps.selectionRange.cellB.row
        )) ||
      (this.props.selectionRange &&
        this.props.selectionRange.cellA &&
        this.props.selectionRange.cellB &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          this.props.selectionRange.cellA.row,
          this.props.selectionRange.cellB.row
        ))
    ) {
      return true
    }
    if (
      (nextProps.selectionFillHandleRange &&
        nextProps.selectionFillHandleRange.cellA &&
        nextProps.selectionFillHandleRange.cellB &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          nextProps.selectionFillHandleRange.cellA.row,
          nextProps.selectionFillHandleRange.cellB.row
        )) ||
      (this.props.selectionFillHandleRange &&
        nextProps.selectionFillHandleRange.cellA &&
        nextProps.selectionFillHandleRange.cellB &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          this.props.selectionFillHandleRange.cellA.row,
          this.props.selectionFillHandleRange.cellB.row
        ))
    ) {
      return true
    }
    var shouldUpdate = false
    var currentProps = this.props
    var attrs = _.filter(_.allKeys(nextProps.item.document), function (key) {
      return key[0] !== '_'
    })
    shouldUpdate =
      !shouldUpdate &&
      _.some(attrs, function (key) {
        return (
          (nextProps.item.document && !currentProps.item.document) ||
          (!nextProps.item.document && currentProps.item.document) ||
          nextProps.item.document[key] !== currentProps.item.document[key]
        )
      })
    shouldUpdate =
      shouldUpdate || !_.isEqual(currentProps.item.focus, nextProps.item.focus)
    shouldUpdate =
      shouldUpdate || currentProps.isChecking !== nextProps.isChecking
    shouldUpdate =
      shouldUpdate || currentProps.item.isChecked !== nextProps.item.isChecked
    shouldUpdate =
      shouldUpdate || currentProps.item.status !== nextProps.item.status
    return shouldUpdate
  }

  isRowInSelectionRange = (row, rowA, rowB) => {
    var min = Math.min(rowA, rowB)
    var max = Math.max(rowA, rowB)
    return row >= min && row <= max
  }

  isCellInSelectionRange = (cell, cellA, cellB) => {
    if (!cell || !cellA || !cellB) return false
    var minRow = Math.min(cellA.row, cellB.row)
    var maxRow = Math.max(cellA.row, cellB.row)
    var minCol = Math.min(cellA.col, cellB.col)
    var maxCol = Math.max(cellA.col, cellB.col)
    return (
      cell.col >= minCol &&
      cell.col <= maxCol &&
      cell.row >= minRow &&
      cell.row <= maxRow
    )
  }

  render() {
    var item = this.props.item
    var itemDocument = item.document
    var virtualID = item.virtualID
    var columns = this.props.columns || []
    var selectionRange = this.props.selectionRange
    var fillHandleCell =
      selectionRange.cellA && selectionRange.cellB
        ? {
          row: Math.max(selectionRange.cellA.row, selectionRange.cellB.row),
          col: Math.max(selectionRange.cellA.col, selectionRange.cellB.col),
        }
        : null
    if (!itemDocument) {
      itemDocument = {}
    }
    const handlers = {
      editCell: this.onEnter,
      exitEdit: this.onEscape,
      rename: this.onEnter,
      openForm: this.onOpenForm,
      checkRow: this.onSpace,
      removeRow: this.handleRemove,
    }
    return (
      <HotKeys
        ref={input => {
          this.rowlist = input
        }}
        handlers={handlers}
        className="flex relative no-underline mv0"
        style={{ height: '44px' }}
      >
        <div
          onMouseEnter={() => this.setState({ isHoveringIndexCell: true })}
          onMouseLeave={() => this.setState({ isHoveringIndexCell: false })}
          className="flex items-center justify-center bg-near-white bl br bb b--silver"
          style={{ minWidth: '50px', height: '44px' }} >
          <div
            className={
              this.props.isChecking || this.state.isHoveringIndexCell
                ? 'db' : 'dn'}>
            <input
              ref={input => {
                this.rowCheckBox = input
              }}
              type="checkbox"
              onChange={this.handleCheckRow}
              checked={item.isChecked || false}
            />
          </div>
          <div
            className={
              this.props.isChecking || this.state.isHoveringIndexCell
                ? 'dn' : 'db'}>
            {new Intl.NumberFormat().format(virtualID + 1)}
          </div>
        </div>
        {columns.map((column, colIndex) => {
          const props = this.createPropsObject(
            column,
            columns.length,
            item,
            colIndex,
            fillHandleCell
          )
          return (
            <Cell
              key={`${virtualID}-${colIndex}`}
              setChanges={this.props.setChanges}
              {...props}
            />
          )
        })}
      </HotKeys>
    )
  }

  createPropsObject = (
    column,
    columnsCount,
    item,
    colIndex,
    fillHandleCell
  ) => {
    return _.extend(column, {
      columnsCount: columnsCount,
      path: `.${column.fieldName}`,
      validationErrors: item.validationErrors
        ? _.filter(item.validationErrors, error => {
          return (
            error.dataPath.includes(`.${column.fieldName}[`) ||
            error.dataPath.includes(`.${column.fieldName}.`) ||
            error.dataPath === `.${column.fieldName}`
          )
        })
        : [],
      width: column.width,
      cell: { row: item.virtualID, col: colIndex },
      value: item.document[column.fieldName],
      linkedValue: document[`${column.fieldName}_linked`],
      id: item.document.id,
      onSelectCell: this.props.onSelectCell,
      onFillHandleDown: this.props.onFillHandleDown,
      onFillHandleUp: this.props.onFillHandleUp,
      onExitEditCell: this.onExitEditCell,
      onFocusCell: this.onFocusCell,
      onEditCell: this.props.onEditCell,
      showLabel: false,
      isSelected:
        this.props.selectionRange &&
        this.isCellInSelectionRange(
          { row: item.virtualID, col: colIndex },
          this.props.selectionRange.cellA,
          this.props.selectionRange.cellB
        ),
      isFillHandleSelected:
        this.props.selectionFillHandleRange &&
        this.isCellInSelectionRange(
          { row: item.virtualID, col: colIndex },
          this.props.selectionFillHandleRange.cellA,
          this.props.selectionFillHandleRange.cellB
        ),
      isFillHandleCell:
        fillHandleCell &&
        item.virtualID === fillHandleCell.row &&
        colIndex === fillHandleCell.col,
      isFocus:
        this.props.focusedCell &&
        this.props.focusedCell.row === item.virtualID &&
        this.props.focusedCell.col === colIndex,
      isEditing:
        this.props.editingCell &&
        this.props.editingCell.row === item.virtualID &&
        this.props.editingCell.col === colIndex,
    })
  }

  handleCheckRow = (ev) => {
    this.props.onCheckRowChange(this.props.item.document.id, ev.target.checked)
  }

  handleEdit = () => {
    this.props.onEditItem(this.props.item)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.item, this.props.context, this.onFormClose)
  }

  onFocusCell = (cell) => {
    this.props.onFocusCell(cell)
  }

  onEditCell = (cell) => {
    this.props.onEditCell(cell)
  }

  onExitEditCell = (cell) => {
    this.props.onExitEditCell(cell)
  }

  onEnter = () => {
    this.onEditCell(this.props.focusedCell)
  }

  onEscape = () => {
    this.onExitEditCell(this.props.editingCell)
  }

  onFormClose = () => {
    // ReactDom.findDOMNode(this).focus()
    if (this.focus) {
      this.focus()
    } else { console.log('No this to focus on Row.react.js') }
  }

  onOpenForm = () => {
    // como os componentes filhos não implementam esta key, é possivél abrir um formulario com uma celula em modo de edição
    // Por isso antes de abrir o formulario vamos validar que não tem celulas em modo de edição
    if (!this.props.editingCell) {
      this.props.onEdit(this.props.item, this.props.context, this.onFormClose)
    }
  }

  onSpace = () => {
    var checked
    if (window && document) { // wat
      checked = ReactDom.findDOMNode(this.rowCheckBox).checked
    }
    this.props.onCheckRowChange(this.props.item.document.id, !checked)
  }
}

Row.propTypes = {
  item: PropTypes.object,
  context: PropTypes.object,
  onCheckRowChange: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEditCell: PropTypes.func,
  onEdit: PropTypes.func,
  onEditItem: PropTypes.func,
  onSelectCell: PropTypes.func,
  onFocusCell: PropTypes.func,
  onRemove: PropTypes.func,
  setChanges: PropTypes.func,
  columns: PropTypes.array,
  isChecking: PropTypes.bool,
  renderValue: PropTypes.any,
  focusedCell: PropTypes.object,
  editingCell: PropTypes.object,
  selectionRange: PropTypes.object,
  selectionFillHandleRange: PropTypes.object,
  onFillHandleDown: PropTypes.func,
  onFillHandleUp: PropTypes.func,
}

export default Row
