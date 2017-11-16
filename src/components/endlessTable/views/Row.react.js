import '../css/row-options.less'
import React from 'react'
import ReactDom from 'react-dom'
import _ from 'underscore'
import Actions from '../actions/Actions'
// import MainActions from '../../../actions/Actions'
import Store from '../stores/RowsStore'
import STATUS from '../../stores/Status'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'

class Row extends React.Component {
  constructor(props) {
    super(props)

    this.handleCheckRow = this.handleCheckRow.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.onFocusCell = this.onFocusCell.bind(this)
    this.onEditCell = this.onEditCell.bind(this)
    this.onExitEditCell = this.onExitEditCell.bind(this)
    this.onStoreChange = this.onStoreChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onEscape = this.onEscape.bind(this)
    this.onOpenForm = this.onOpenForm.bind(this)
    this.onFormClose = this.onFormClose.bind(this)
    this.onSpace = this.onSpace.bind(this)
    this.onAnimationEnd = this.onAnimationEnd.bind(this)
    this.state = {
      selectedCell: {},
      editingCell: {},
      selectionRange: { cellA: {}, cellB: {} },
      fillHandleCell: {},
    }
  }
  componentDidMount() {
    var row = ReactDom.findDOMNode(this.rowlist)
    row.addEventListener('animationend', this.onAnimationEnd, false)
    // this.unsubscribe = Store.listen(this.onStoreChange)
  }
  componentWillUnmount() {
    // this.unsubscribe()
  }
  onAnimationEnd() {
    if (this.props.item.status === STATUS.SESUPDATED) {
      // MainActions.changeRowStatus(
      //   this.props.context,
      //   this.props.item.virtualID,
      //   STATUS.LOADED
      // )
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.columns !== nextProps.columns) return true
    if (
      (nextState.selectedCell &&
        this.props.item.virtualID === nextState.selectedCell.row) ||
      (this.state.selectedCell &&
        this.props.item.virtualID === this.state.selectedCell.row)
    ) {
      return true
    }
    if (
      (nextState.selectionRange &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          nextState.selectionRange.cellA.row,
          nextState.selectionRange.cellB.row
        )) ||
      (this.state.selectionRange &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          this.state.selectionRange.cellA.row,
          this.state.selectionRange.cellB.row
        ))
    ) {
      console.log(`updateRow:${this.props.item.virtualID}`)
      return true
    }
    if (
      (nextState.selectionFillHandleRange &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          nextState.selectionFillHandleRange.cellA.row,
          nextState.selectionFillHandleRange.cellB.row
        )) ||
      (this.state.selectionFillHandleRange &&
        this.isRowInSelectionRange(
          this.props.item.virtualID,
          this.state.selectionFillHandleRange.cellA.row,
          this.state.selectionFillHandleRange.cellB.row
        ))
    ) {
      console.log('HandleFillRow')
      return true
    }
    var shouldUpdate = false
    var currentProps = this.props
    var attrs = _.filter(_.allKeys(nextProps.item.document), function(key) {
      return key[0] !== '_'
    })
    shouldUpdate =
      !shouldUpdate &&
      _.some(attrs, function(key) {
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

  isRowInSelectionRange(row, rowA, rowB) {
    var min = Math.min(rowA, rowB)
    var max = Math.max(rowA, rowB)
    return row >= min && row <= max
  }

  isCellInSelectionRange(cell, cellA, cellB) {
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
    var that = this
    var item = this.props.item
    var document = item.document
    var virtualID = item.virtualID
    var columns = this.props.columns || []
    var renderValue = this.props.renderValue
    var onFocusCell = this.onFocusCell
    var onEditCell = this.onEditCell
    var onExitEditCell = this.onExitEditCell
    var selectedCell = this.state.selectedCell
    var editingCell = this.state.editingCell
    var selectionRange = this.state.selectionRange
    var selectionFillHandleRange = this.state.selectionFillHandleRange
    var fillHandleCell = this.state.fillHandleCell
    var rowStyle = ''
    if (this.state.selectedCell.row === virtualID) {
      rowStyle += 'list-row-selected '
    }
    if (this.props.isChecking) {
      rowStyle += 'list-row-checking '
    }
    if (this.props.item.isChecked) {
      rowStyle += 'list-row-checked '
    }
    rowStyle += `list-row-${this.props.item.status}`
    rowStyle += virtualID === 0 ? ' first-row' : ''
    // var animationStyle = this.props.item.status === STATUS.SESUPDATED
    //  ? 'row-animation'
    //  : ''
    if (!document) {
      document = {}
    }
    var id = document.id ? document.id : ''
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
        className={rowStyle}
      >
        <div className="first-cell flex items-center justify-center">
          <div className="select">
            <input
              ref={input => {
                this.rowCheckBox = input
              }}
              type="checkbox"
              onChange={this.handleCheckRow}
              checked={item.isChecked || false}
            />
          </div>
          <div className="view">
            {new Intl.NumberFormat().format(virtualID + 1)}
          </div>
        </div>
        <div className="row-options">
          <i className="fa fa-pencil" onClick={this.handleEdit} />
        </div>
        {columns.map(function(column, colIndex) {
          return renderValue(
            _.extend(column, {
              columnsCount: columns.length,
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
              cell: { row: virtualID, col: colIndex },
              value: document[column.fieldName],
              linkedValue: document[`${column.fieldName}_linked`],
              id: id,
              onSelectCell: that.props.onSelectCell,
              onFillHandleDown: that.props.onFillHandleDown,
              onFillHandleUp: that.props.onFillHandleUp,
              onExitEditCell: onExitEditCell,
              onFocusCell: onFocusCell,
              onEditCell: onEditCell,
              showLabel: false,
              isSelected: selectionRange &&
                that.isCellInSelectionRange(
                  { row: virtualID, col: colIndex },
                  selectionRange.cellA,
                  selectionRange.cellB
                ),
              isFillHandleSelected: selectionFillHandleRange &&
                that.isCellInSelectionRange(
                  { row: virtualID, col: colIndex },
                  selectionFillHandleRange.cellA,
                  selectionFillHandleRange.cellB
                ),
              isFillHandleCell: virtualID === fillHandleCell.row &&
                colIndex === fillHandleCell.col,
              isFocus: selectedCell &&
                selectedCell.row === virtualID &&
                selectedCell.col === colIndex,
              isEditing: editingCell &&
                editingCell.row === virtualID &&
                editingCell.col === colIndex,
            })
          )
        })}
      </HotKeys>
    )
  }

  handleCheckRow(ev) {
    this.props.onCheckRow(
      this.props.context,
      this.props.item.document.id,
      ev.target.checked
    )
  }
  handleEdit() {
    this.props.onEdit(this.props.item, this.props.context, this.onFormClose)
  }
  handleRemove() {
    this.props.onRemove(this.props.item, this.props.context, this.onFormClose)
  }
  onFocusCell(cell) {
    this.props.onFocusCell(cell)
  }
  onEditCell(cell) {
    Actions.editCell(cell)
  }
  onExitEditCell(cell) {
    Actions.exitEditCell(cell)
  }
  onEnter() {
    this.onEditCell(this.state.selectedCell)
  }
  onEscape() {
    this.onExitEditCell(this.state.editingCell)
  }
  onStoreChange() {
    var selectionFillHandleRange = null
    var store = Store.get()
    var fillHandleCell = {
      row: Math.max(
        store.selectionRange.cellA.row,
        store.selectionRange.cellB.row
      ),
      col: Math.max(
        store.selectionRange.cellA.col,
        store.selectionRange.cellB.col
      ),
    }
    if (store.selectionFillHandleRange) {
      // fillHandleCell = {
      //   row: Math.max(
      //     store.selectionFillHandleRange.cellA.row,
      //     store.selectionFillHandleRange.cellB.row
      //   ),
      //   col: Math.max(
      //     store.selectionFillHandleRange.cellA.col,
      //     store.selectionFillHandleRange.cellB.col
      //   ),
      // }
      selectionFillHandleRange = {}
      selectionFillHandleRange.cellA = {}
      selectionFillHandleRange.cellB = {}
      selectionFillHandleRange.cellA = store.selectionFillHandleRange.cellA
      selectionFillHandleRange.cellB = store.selectionFillHandleRange.cellB
    }
    var selectionRange = {}
    selectionRange.cellA = {}
    selectionRange.cellB = {}
    selectionRange.cellA = store.selectionRange.cellA
    selectionRange.cellB = store.selectionRange.cellB

    this.setState({
      selectedCell: store.focusedCell,
      editingCell: store.editingCell,
      selectionRange: selectionRange,
      fillHandleCell: fillHandleCell,
      selectionFillHandleRange: selectionFillHandleRange,
    })
  }

  onFormClose() {
    ReactDom.findDOMNode(this).focus()
  }
  onOpenForm() {
    // como os componentes filhos não implementam esta key, é possivél abrir um formulario com uma celula em modo de edição
    // Por isso antes de abrir o formulario vamos validar que não tem celulas em modo de edição
    if (!this.state.editingCell) {
      this.props.onEdit(this.props.item, this.props.context, this.onFormClose)
    }
  }
  onSpace() {
    var checked = ReactDom.findDOMNode(this.rowCheckBox).checked
    this.props.onCheckRow(
      this.props.context,
      this.props.item.document.id,
      !checked
    )
  }
}
Row.propTypes = {
  item: PropTypes.object,
  context: PropTypes.object,
  onCheckRow: PropTypes.func,
  onEdit: PropTypes.func,
  onFocusCell: PropTypes.func,
  onRemove: PropTypes.func,
  columns: PropTypes.array,
  isChecking: PropTypes.bool,
  renderValue: PropTypes.any,
}

export default Row
