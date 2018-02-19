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
  checkItem,
  updateItem,
} from '../actions/items-actions'

const mapStateToProps = (state, ownProps) => {
  return {
    context: ownProps.context,
    fetchSize: ownProps.fetchSize,
    UISchema: ownProps.UISchema,
    schema: ownProps.schema,
    where: state.items.where,
    sort: state.items.sort,
    items: ListITems(state.items),
    focusedCell: state.table.focusedCell,
    editingCell: state.table.editingCell,
    selectionRange: state.table.selectionRange,
    selectionFillHandleRange: state.table.selectionRange,
  }
}

function ListITems(state) {
  var returnValue = []
  const items = state.source || []
  const newItems = []
  if (state.staging) {
    Object.keys(state.staging).forEach(id => {
      if (state.staging[id].status === Status.NEW) {
        newItems.push(state.staging[id])
      }
    })
  }
  const allItems = [...items, ...newItems]

  allItems.forEach(item => {
    let staging
    if (item.document) {
      staging = state.staging[item.document.id] || {}
    } else {
      staging = {}
    }
    var newItem = Object.assign({}, item, staging)

    // if (store.filter.filteredStatus.length > 0) {
    //   if (
    //     (_.contains(store.filter.filteredStatus, Status.SELECTED) &&
    //       !newItem.isChecked) ||
    //     (_.contains(store.filter.filteredStatus, Status.INVALID) &&
    //       (newItem.isValid === undefined || newItem.isValid)) ||
    //     (_.contains(store.filter.filteredStatus, Status.STAGING) &&
    //       newItem.status !== Status.STAGING &&
    //       newItem.status !== Status.NEW &&
    //       newItem.status !== Status.DELETED)
    //   ) {
    //     return
    //   }
    // }

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

    onCheckRow: index => {
      dispatch(checkItem(index))
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
