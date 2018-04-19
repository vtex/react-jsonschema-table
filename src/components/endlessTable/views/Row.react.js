import React from 'react'
import ReactDom from 'react-dom'
import _ from 'underscore'
// import Actions from '../actions/Actions'
// import Store from '../stores/RowsStore'
import STATUS from '../../../constants/Status'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'
import Cell from './Cell.react'

class Row extends React.Component {
  constructor(props) {
    super(props)

    this.handleCheckRow = this.handleCheckRow.bind(this)
    // this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.onFocusCell = this.onFocusCell.bind(this)
    this.onEditCell = this.onEditCell.bind(this)
    this.onExitEditCell = this.onExitEditCell.bind(this)
    // this.onStoreChange = this.onStoreChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onEscape = this.onEscape.bind(this)
    this.onOpenForm = this.onOpenForm.bind(this)
    this.onFormClose = this.onFormClose.bind(this)
    this.onSpace = this.onSpace.bind(this)
    this.onAnimationEnd = this.onAnimationEnd.bind(this)
  }
  componentDidMount() {
    var row
    if (window && document) {
      row = ReactDom.findDOMNode(this.rowlist)
    }
    row && row.addEventListener('animationend', this.onAnimationEnd, false)
    // this.unsubscribe = Store.listen(this.onStoreChange)
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
  shouldComponentUpdate(nextProps) {
    if (this.props.columns !== nextProps.columns) return true
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
    console.log('render row item', this.props.item)
    // var that = this
    var item = this.props.item
    var itemDocument = item.document
    var virtualID = item.virtualID
    var columns = this.props.columns || []
    // var renderValue = this.props.renderValue
    // var onFocusCell = this.onFocusCell
    // var onEditCell = this.onEditCell
    // var onExitEditCell = this.onExitEditCell
    var focusedCell = this.props.focusedCell
    // var editingCell = this.props.editingCell
    var selectionRange = this.props.selectionRange
    // var selectionFillHandleRange = this.props.selectionFillHandleRange
    var fillHandleCell =
      selectionRange.cellA && selectionRange.cellB
        ? {
          row: Math.max(selectionRange.cellA.row, selectionRange.cellB.row),
          col: Math.max(selectionRange.cellA.col, selectionRange.cellB.col),
        }
        : null
    var rowStyle = ''
    switch(this.props.item.status) {
      case 'loaded':
      case 'header':
      case 'new':
      case 'lazzy':
      case 'loaded':
      case 'deleted':
      case 'imported':
      case 'sesupdated':
      case 'staging':
      case 'checking':
      case 'selecte':
        rowStyle += 'flex relative no-underline br b--silver mv0 '
        break;
    }
    // if (focusedCell && focusedCell.row === virtualID) {
    //   rowStyle += 'list-row-selected '
    // }
    // if (this.props.isChecking) {
    //   rowStyle += 'list-row-checking '
    // }
    // if (this.props.item.isChecked) {
    //   rowStyle += 'list-row-checked '
    // }
    // rowStyle += `list-row-${this.props.item.status}`
    // rowStyle += virtualID === 0 ? ' first-row' : ''
    // var animationStyle = this.props.item.status === STATUS.SESUPDATED
    //  ? 'row-animation'
    //  : ''
    if (!itemDocument) {
      itemDocument = {}
    }
    // var id = itemDocument.id ? itemDocument.id : ''
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
        style={{ height: '35px' }}
      >
        <div
            className="flex items-center justify-center bl br bb b--silver"
            style={{minWidth: '50px', height: '35px'}} >
          <div className={this.props.isChecking ? 'db' : 'dn'}>
            <input
              ref={input => {
                this.rowCheckBox = input
              }}
              type="checkbox"
              onChange={this.handleCheckRow}
              checked={item.isChecked || false}
            />
          </div>
          <div className={this.props.isChecking ? 'dn' : 'db'}>
            {new Intl.NumberFormat().format(virtualID + 1)}
          </div>
        </div>
        <div
          className="relative flex items-center justify-center bg-transparent bn tl ph4 f3"
          style={{ minWidth: '30px', width: '30px'}}
          onClick={this.handleEdit}>
          <i className="pointer fa fa-expand" />
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

  handleCheckRow(ev) {
    this.props.onCheckRowChange(this.props.item.document.id, ev.target.checked)
  }
  handleEdit = () => {
    this.props.onEditItem(this.props.item)
    // this.props.onEdit(this.props.item, this.props.context, this.onFormClose)
  }
  handleRemove() {
    this.props.onRemove(this.props.item, this.props.context, this.onFormClose)
  }
  onFocusCell(cell) {
    this.props.onFocusCell(cell)
  }
  onEditCell(cell) {
    this.props.onEditCell(cell)
  }
  onExitEditCell(cell) {
    this.props.onExitEditCell(cell)
  }
  onEnter() {
    this.onEditCell(this.props.focusedCell)
  }
  onEscape() {
    this.onExitEditCell(this.props.editingCell)
  }
  onStoreChange() {
    // var selectionFillHandleRange = null
    // var store = Store.get()
    // var fillHandleCell = {
    //   row: Math.max(
    //     store.selectionRange.cellA.row,
    //     store.selectionRange.cellB.row
    //   ),
    //   col: Math.max(
    //     store.selectionRange.cellA.col,
    //     store.selectionRange.cellB.col
    //   ),
    // }
    // if (store.selectionFillHandleRange) {
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
    //   selectionFillHandleRange = {}
    //   selectionFillHandleRange.cellA = {}
    //   selectionFillHandleRange.cellB = {}
    //   selectionFillHandleRange.cellA = store.selectionFillHandleRange.cellA
    //   selectionFillHandleRange.cellB = store.selectionFillHandleRange.cellB
    // }
    // var selectionRange = {}
    // selectionRange.cellA = {}
    // selectionRange.cellB = {}
    // selectionRange.cellA = store.selectionRange.cellA
    // selectionRange.cellB = store.selectionRange.cellB
    // this.setState({
    //   selectedCell: store.focusedCell,
    //   editingCell: store.editingCell,
    //   selectionRange: selectionRange,
    //   fillHandleCell: fillHandleCell,
    //   selectionFillHandleRange: selectionFillHandleRange,
    // })
  }

  onFormClose() {
    // ReactDom.findDOMNode(this).focus()
    if (this.focus) {
      this.focus()
    } else { console.log('No this to focus on Row.react.js') }
  }
  onOpenForm() {
    // como os componentes filhos não implementam esta key, é possivél abrir um formulario com uma celula em modo de edição
    // Por isso antes de abrir o formulario vamos validar que não tem celulas em modo de edição
    if (!this.props.editingCell) {
      this.props.onEdit(this.props.item, this.props.context, this.onFormClose)
    }
  }
  onSpace() {
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
