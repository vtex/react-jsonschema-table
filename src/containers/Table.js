import { connect } from 'react-redux'
import Table from '../components/endlessTable/views/Table.react'
import Status from '../constants/Status'
import {
  editCell,
  exitEditCell,
  selectCell,
  selectFillHandleRange,
  selectCellsRange,
} from '../actions/table-actions'
import {
  removeItem,
  fetchItems,
  checkItemChange,
  updateItem,
} from '../actions/items-actions'

const mapStateToProps = (state, ownProps) => {
  return {
    context: ownProps.context,
    fetchSize: ownProps.fetchSize,
    UIschema: ownProps.UIschema,
    schema: ownProps.schema,
    where: state.items.where,
    sort: state.items.sort,
    items: ListITems(state),
    focusedCell: state.table.focusedCell,
    editingCell: state.table.editingCell,
    selectionRange: state.table.selectionRange,
    selectionFillHandleRange: state.table.selectionRange,
    isChecking: state.items.checkedItems && state.items.checkedItems.length > 0,
    hiddenFields: state.filter.hiddenFields,
  }
}

function ListITems(state) {
  var returnValue = []
  const items = state.items.source || []
  const newItems = []
  if (state.items.staging) {
    Object.keys(state.items.staging).forEach(id => {
      if (state.items.staging[id].status === Status.NEW) {
        newItems.push(state.items.staging[id])
      }
    })
  }
  const allItems = [...items, ...newItems]

  allItems.forEach(item => {
    let staging
    if (item.document) {
      staging = state.items.staging[item.document.id] || {}
    } else {
      staging = {}
    }
    var newItem = Object.assign({}, item, staging)
    if (state.items.checkedItems.includes(newItem.document.id)) {
      newItem.isChecked = true
    }
    if (
      (state.filter.isStagingFilterActive &&
        !state.items.stagingItems.includes(newItem.document.id)) ||
      (state.filter.isInvalidFilterActive &&
        !state.items.invalidItems.includes(newItem.document.id)) ||
      (state.filter.isSelectedFilterActive &&
        !state.items.checkedItems.includes(newItem.document.id))
    ) {
      return
    }

    newItem.virtualID = returnValue.length
    returnValue.push(newItem)
  })
  return returnValue
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFetchItems: (context, fields, skip, size, where, sort) => {
      dispatch(fetchItems(context, fields, skip, size, where, sort))
    },

    onRemove: index => {
      dispatch(removeItem(index, ownProps.schema, ownProps.lang))
    },

    onCheckRowChange: (id, isChecked) => {
      dispatch(checkItemChange(id, isChecked))
    },

    onSelectCellsRange: (cellA, cellB) => {
      dispatch(selectCellsRange(cellA, cellB))
    },

    onSelectFillHandleRange: (cellA, cellB) => {
      dispatch(selectFillHandleRange(cellA, cellB))
    },

    onFocusCell: cell => {
      dispatch(selectCell(cell))
    },

    onEditCell: cell => {
      dispatch(editCell(cell))
    },

    onExitEditCell: cell => {
      dispatch(exitEditCell(cell))
    },
    setChanges: (id, changes) => {
      dispatch(updateItem(id, ownProps.schema, changes, ownProps.lang))
    },
  }
}

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(Table)

export default TableContainer
