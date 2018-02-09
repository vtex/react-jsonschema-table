import React from 'react'
import _ from 'underscore'
import VirtualList from '../views/VirtualList'
// import Store from '../stores/RowsStore.js'
// import Actions from '../actions/Actions.js'
// import MainActions from '../../../actions/Actions.js'
import { HotKeys } from 'react-hotkeys'
import Row from './Row.react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
// import { FormattedMessage } from 'react-intl'

class Rows extends React.Component {
  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.checkPageRange = this.checkPageRange.bind(this)
    this.onMoveRight = this.onMoveRight.bind(this)
    this.onMoveLeft = this.onMoveLeft.bind(this)
    this.onMassMoveRight = this.onMassMoveRight.bind(this)
    this.onMassMoveLeft = this.onMassMoveLeft.bind(this)
    this.onMoveUp = this.onMoveUp.bind(this)
    this.onMoveDown = this.onMoveDown.bind(this)
    this.onMassSelectDown = this.onMassSelectDown.bind(this)
    this.onMassSelectUp = this.onMassSelectUp.bind(this)
    this.handleInitSelection = this.handleInitSelection.bind(this)
    this.handleEndSelection = this.handleEndSelection.bind(this)
    this.onCopy = this.onCopy.bind(this)
    this.onCopy = _.throttle(this.onCopy, 200)
    // this.onMoveDown = _.throttle(this.onMoveDown, 50)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleSelectCell = this.handleSelectCell.bind(this)
    this.handleFillHandleDown = this.handleFillHandleDown.bind(this)
    this.OnFillHandleUp = this.OnFillHandleUp.bind(this)
    this.isCellInSelectionRange = this.isCellInSelectionRange.bind(this)
    this.getSelectedRangeValues = this.getSelectedRangeValues.bind(this)
  }
  render() {
    if (
      !this.props.columns ||
      !this.props.items ||
      !this.props.items.length ||
      this.props.items.length === 0
    ) {
      return <span />
    }
    const handlers = {
      moveRight: this.onMoveRight,
      moveLeft: this.onMoveLeft,
      moveDown: this.onMoveDown,
      moveUp: this.onMoveUp,
      massSelectRight: this.onMassMoveRight,
      massSelectLeft: this.onMassMoveLeft,
      massSelectDown: this.onMassSelectDown,
      massSelectUp: this.onMassSelectUp,
      initSelection: this.handleInitSelection,
      endSelection: this.handleEndSelection,
      copy: this.onCopy,
    }

    const listContainer = document.getElementById('listContainer')

    return (
      // <ContextMenuTrigger id="contextMenuRows">
      <HotKeys
        handlers={handlers}
        onMouseUp={this.handleEndSelection}
        onMouseDown={this.handleInitSelection}
        ref={ref => {
          this.rows = ref
        }}
      >
        <VirtualList
          ref={div => {
            this.virtualList = div
          }}
          items={this.props.items}
          className="list-body"
          container={listContainer}
          itemHeight={34}
          renderItem={this.renderItem}
          tagName="div"
          scrollDelay={0}
        />
        <div
          ref={ref => {
            this.clipboardContainer = ref
          }}
          className="clipboard-container"
        >
          <textarea
            ref={ref => {
              this.clipboard = ref
            }}
            className="clipboard"
          />
        </div>
      </HotKeys>
      // <ContextMenu id="contextMenuRows">
      //   <MenuItem onClick={() => this.onCopy()}>
      //     <FormattedMessage id="Contextualmenu.copy" />
      //   </MenuItem>
      //   <MenuItem onClick={() => this.handlePaste()}>
      //     <FormattedMessage id="Contextualmenu.paste" />
      //   </MenuItem>
      // </ContextMenu>
      // </ContextMenuTrigger>
    )
  }
  renderItem(item) {
    this.checkPageRange(item.virtualID)
    return (
      <Row
        item={item}
        key={`row-${item.virtualID}`}
        onSelectCell={this.handleSelectCell}
        onFocusCell={this.handleFocusCell}
        onEditCell={this.handleEditCell}
        onExitEditCell={this.handleExitEditCell}
        onFillHandleDown={this.handleFillHandleDown}
        {...this.props}
      />
    )
  }
  checkPageRange(virtualID) {
    var items = this.props.items
    var index = _.findIndex(items, function(item) {
      return item.virtualID === virtualID
    })

    // Verifica se o documento atual está carregado.
    if (!items[index].document) {
      this.props.onGetNotLoadedDocument(index)
    } else {
      // Se o documento atual estiver carregado, então verifica se o centésimo item para frente e para trás estão carregados
      var futureIndex = index + 50
      if (futureIndex >= items.length) {
        futureIndex = items.length - 1
      }
      if (!items[futureIndex].document) {
        this.props.onGetNotLoadedDocument(futureIndex)
      }
      var pastIndex = index - 50
      if (pastIndex < 0) {
        pastIndex = 0
      }
      if (!items[pastIndex].document) {
        this.props.onGetNotLoadedDocument(pastIndex)
      }
    }
  }
  handleInitSelection(e) {
    e.preventDefault()
    const isMouseDown = e.type === 'mousedown'
    this.setState({ initSelection: true, isMouseDown: isMouseDown })
  }
  handleEditCell(cell) {
    this.props.onEditCell(cell)
  }

  handleExitEditCell(cell) {
    this.props.onExitEditCell(cell)
  }

  handleEndSelection() {
    if (this.state.isFillHandleOn) {
      this.OnFillHandleUp()
    }
    this.setState({
      initSelection: false,
      isFillHandleOn: false,
      isMouseDown: false,
    })
  }
  onMoveDown(e) {
    var LastVisibleItem = this.virtualList.visibleItems()[
      this.virtualList.visibleItems().length - 1
    ]
    e.preventDefault()
    var newSelection = {}
    var selectedCell = this.props.focusedCell
    newSelection.row =
      this.props.items.length - 1 === selectedCell.row
        ? selectedCell.row
        : selectedCell.row + 1
    newSelection.col = selectedCell.col
    if (newSelection.row >= LastVisibleItem.virtualID) {
      this.props.onScroll(34)
    }
    this.props.onSelectCell(newSelection)
  }
  onMoveUp(e) {
    var firstVisibleItem = this.virtualList.visibleItems()[0]
    e.preventDefault()
    var newSelection = {}
    var selectedCell = this.props.focusedCell
    newSelection.row =
      selectedCell.row !== 0 ? selectedCell.row - 1 : selectedCell.row
    newSelection.col = selectedCell.col
    if (newSelection.row <= firstVisibleItem.virtualID) {
      this.props.onScroll(-34)
    }
    this.props.onSelectCell(newSelection)
  }
  onMassSelectDown(e) {
    var LastVisibleItem = this.virtualList.visibleItems()[
      this.virtualList.visibleItems().length - 1
    ]
    e.preventDefault()
    var newSelectionA = {}
    var newSelectionB = {}
    var selectionRange = this.props.selectionRange
    var focusedCell = this.props.focusedCell
    var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
    var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
    var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
    var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
    if (minRow < focusedCell.row) {
      newSelectionA.col = minCol
      newSelectionA.row =
        this.props.items.length - 1 === minRow ? minRow : minRow + 1
      newSelectionB.row = maxRow
      newSelectionB.col = maxCol
    } else {
      newSelectionA.col = minCol
      newSelectionA.row = minRow
      newSelectionB.row =
        this.props.items.length - 1 === maxRow ? maxRow : maxRow + 1
      newSelectionB.col = maxCol
    }
    if (newSelectionB.row >= LastVisibleItem.virtualID) {
      this.props.onScroll(34)
    }
    this.props.onSelectCellsRange(newSelectionA, newSelectionB)
  }
  onMassSelectUp(e) {
    var firstVisibleItem = this.virtualList.visibleItems()[0]
    e.preventDefault()
    var newSelectionA = {}
    var newSelectionB = {}
    var selectionRange = this.props.selectionRange
    var focusedCell = this.props.focusedCell
    var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
    var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
    var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
    var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
    if (focusedCell.row < maxRow) {
      newSelectionA.col = minCol
      newSelectionA.row = minRow
      newSelectionB.row = maxRow !== 0 ? maxRow - 1 : maxRow
      newSelectionB.col = maxCol
    } else {
      newSelectionA.col = minCol
      newSelectionA.row = minRow !== 0 ? minRow - 1 : minRow
      newSelectionB.row = maxRow
      newSelectionB.col = maxCol
    }
    if (newSelectionA.row <= firstVisibleItem.virtualID) {
      this.props.onScroll(-34)
    }
    this.props.onSelectCellsRange(newSelectionA, newSelectionB)
  }
  onMoveRight(e) {
    e.preventDefault()
    var newSelection = {}
    var selectedCell = this.props.focusedCell
    newSelection.col =
      selectedCell.col === this.props.columns.length - 1
        ? selectedCell.col
        : selectedCell.col + 1
    newSelection.row = selectedCell.row
    this.props.onSelectCell(newSelection)
  }
  onMoveLeft(e) {
    e.preventDefault()
    var newSelection = {}
    var selectedCell = this.props.focusedCell
    newSelection.col =
      selectedCell.col !== 0 ? selectedCell.col - 1 : selectedCell.col
    newSelection.row = selectedCell.row
    this.props.onSelectCell(newSelection)
  }
  onMassMoveRight(e) {
    e.preventDefault()
    var newSelectionA = {}
    var newSelectionB = {}
    var selectionRange = this.props.selectionRange
    var focusedCell = this.props.focusedCell
    var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
    var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
    var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
    var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
    if (minCol < focusedCell.col) {
      newSelectionA.col =
        minCol === this.props.columns.length - 1 ? minCol : minCol + 1
      newSelectionA.row = minRow
      newSelectionB.row = maxRow
      newSelectionB.col = maxCol
    } else {
      newSelectionA.col = minCol
      newSelectionA.row = minRow
      newSelectionB.row = maxRow
      newSelectionB.col =
        maxCol === this.props.columns.length - 1 ? maxCol : maxCol + 1
    }
    this.props.onSelectCellsRange(newSelectionA, newSelectionB)
  }
  onMassMoveLeft(e) {
    e.preventDefault()
    var newSelectionA = {}
    var newSelectionB = {}
    var selectionRange = this.props.selectionRange
    var focusedCell = this.props.focusedCell
    var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
    var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
    var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
    var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
    if (maxCol > focusedCell.col) {
      newSelectionA.col = minCol
      newSelectionA.row = minRow
      newSelectionB.row = maxRow
      newSelectionB.col = maxCol !== 0 ? maxCol - 1 : maxCol
    } else {
      newSelectionA.col = minCol !== 0 ? minCol - 1 : minCol
      newSelectionA.row = minRow
      newSelectionB.row = maxRow
      newSelectionB.col = maxCol
    }
    this.props.onSelectCellsRange(newSelectionA, newSelectionB)
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
  handleFocusCell = cell => {
    if (this.state && this.state.initSelection) {
      this.props.onSelectCellsRange(this.props.focusedCell, cell)
    } else {
      this.props.onSelectCell(cell)
    }
  }
  handleSelectCell(cell) {
    if (this.state && this.state.initSelection && this.state.isMouseDown) {
      this.props.onSelectCellsRange(this.props.focusedCell, cell)
    }
    if (
      this.state &&
      this.state.isFillHandleOn &&
      !this.isCellInSelectionRange(
        cell,
        this.props.selectionRange.cellA,
        this.props.selectionRange.cellB
      )
    ) {
      var selectionRange = this.props.selectionRange
      var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
      var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
      var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
      var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
      var rowDif
      var colDif
      var cellA
      var cellB
      rowDif = Math.min(
        Math.abs(cell.row - selectionRange.cellA.row),
        Math.abs(cell.row - selectionRange.cellB.row)
      )
      colDif = Math.min(
        Math.abs(cell.col - selectionRange.cellA.col),
        Math.abs(cell.col - selectionRange.cellB.col)
      )

      if (cell.row > minRow && cell.row < maxRow) {
        rowDif = 0
      }
      if (cell.col > minCol && cell.col < maxCol) {
        colDif = 0
      }

      if (colDif > rowDif) {
        if (cell.col < minCol) {
          cellA = { row: minRow, col: minCol - 1 }
          cellB = { row: maxRow, col: minCol - colDif }
        } else {
          cellA = { row: minRow, col: maxCol + 1 }
          cellB = { row: maxRow, col: maxCol + colDif }
        }
      } else {
        if (cell.row < minRow) {
          cellA = { row: minRow - 1, col: minCol }
          cellB = { row: minRow - rowDif, col: maxCol }
        } else {
          cellA = { row: maxRow + 1, col: minCol }
          cellB = { row: maxRow + rowDif, col: maxCol }
        }
      }
      this.props.onSelectFillHandleRange(cellA, cellB)
      // Actions.selectFillHandleCell(cellA, cellB)
    }
  }
  onCopy() {
    var value = this.getSelectedRangeValues()
    this.clipboardContainer.style.display = 'block'
    this.clipboard.value = value
    this.clipboard.select()
    document.execCommand('Copy')
  }
  getSelectedRangeValues() {
    var selectionRange = this.props.selectionRange
    var minRow = Math.min(selectionRange.cellA.row, selectionRange.cellB.row)
    var maxRow = Math.max(selectionRange.cellA.row, selectionRange.cellB.row)
    var minCol = Math.min(selectionRange.cellA.col, selectionRange.cellB.col)
    var maxCol = Math.max(selectionRange.cellA.col, selectionRange.cellB.col)
    // copiar o valor de todas as celulas selecionadas e formatar
    var value = ''

    for (var i = minRow; i <= maxRow; i++) {
      for (var j = minCol; j <= maxCol; j++) {
        var fieldName = this.props.columns[j].fieldName
        var fieldValue = this.props.items[i].document[fieldName]
        value += fieldValue
        if (j !== maxCol) {
          value += '\u0009'
        }
      }
      if (i !== maxRow) {
        value += '\u000D\u000A'
      }
    }
    return value
  }
  handlePaste() {
    this.clipboard.focus()
    document.execCommand('paste')
    // var clipText = this.clipboard.value
    // var selectionRange = this.props.selectionRange
    // MainActions.pasteData(
    //   this.props.context,
    //   clipText,
    //   selectionRange.cellA,
    //   selectionRange.cellB,
    //   this.props.columns
    // )
  }
  handleFillHandleDown(e) {
    e.preventDefault()
    e.stopPropagation()
    console.log('fillHandle')
    this.setState({ isFillHandleOn: true })
  }
  OnFillHandleUp() {
    var selectionRange = this.props.selectionRange
    var selectionFillHandleRange = this.props.selectionFillHandleRange
    var minRow = Math.min(
      Math.min(selectionRange.cellA.row, selectionRange.cellB.row),
      Math.min(
        selectionFillHandleRange.cellA.row,
        selectionFillHandleRange.cellB.row
      )
    )
    var maxRow = Math.max(
      Math.max(selectionRange.cellA.row, selectionRange.cellB.row),
      Math.max(
        selectionFillHandleRange.cellA.row,
        selectionFillHandleRange.cellB.row
      )
    )
    var minCol = Math.min(
      Math.min(selectionRange.cellA.col, selectionRange.cellB.col),
      Math.min(
        selectionFillHandleRange.cellA.col,
        selectionFillHandleRange.cellB.col
      )
    )
    var maxCol = Math.max(
      Math.max(selectionRange.cellA.col, selectionRange.cellB.col),
      Math.max(
        selectionFillHandleRange.cellA.col,
        selectionFillHandleRange.cellB.col
      )
    )
    var cellA = { row: minRow, col: minCol }
    var cellB = { row: maxRow, col: maxCol }
    // MainActions.copyFromSelectedRange(
    //   this.props.context,
    //   selectionRange,
    //   selectionFillHandleRange,
    //   this.props.columns
    // )
    this.props.onSelectCellsRange(cellA, cellB)
    // Actions.selectCellsRange(cellA, cellB)
  }
}

Rows.propTypes = {
  columns: PropTypes.any,
  // context: PropTypes.object,
  items: PropTypes.array,
  focusedCell: PropTypes.object,
  editingCell: PropTypes.object,
  selectionRange: PropTypes.object,
  selectionFillHandleRange: PropTypes.object,
  onScroll: PropTypes.func,
  onGetNotLoadedDocument: PropTypes.func,
  onSelectCellsRange: PropTypes.func,
  onSelectFillHandleRange: PropTypes.func,
  onSelectCell: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEditCell: PropTypes.func,
}

export default Rows
