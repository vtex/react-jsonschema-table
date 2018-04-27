import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Table from 'components/endlessTable/views/Table.react'
import { STATUS } from 'table/constants'
import { actionCreators } from 'table/actions'
import {
  removeItem,
  fetchItems,
  checkItemChange,
  updateItem,
  copyFromSelectedRange,
} from 'actions/items-actions'

const mapStateToProps = (state, ownProps) => {
  return {
    form: state.table.form,
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
    selectionFillHandleRange: state.table.selectionFillHandleRange,
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
      if (state.items.staging[id].status === STATUS.NEW) {
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

    // shallow merge
    var newItem = Object.assign({}, item, staging)
    // little deeper merge. TO DO: make deep merge...
    newItem.document = {
      ...item.document || {},
      ...staging.document || {},
    }

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
  const bindedActions = bindActionCreators(actionCreators, dispatch)

  return {
    ...bindedActions,

    onEditItem: (doc) => {
      dispatch(actionCreators.showFormModal(doc))
    },

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
      dispatch(actionCreators.selectCellsRange(cellA, cellB))
    },

    onSelectFillHandleRange: (cellA, cellB) => {
      dispatch(actionCreators.selectFillHandleRange(cellA, cellB))
    },

    onFocusCell: cell => {
      dispatch(actionCreators.selectCell(cell))
    },

    onEditCell: cell => {
      dispatch(actionCreators.editCell(cell))
    },

    onExitEditCell: cell => {
      dispatch(actionCreators.exitEditCell(cell))
    },
    setChanges: (id, changes) => {
      dispatch(updateItem(id, ownProps.schema, changes, ownProps.lang))
    },

    onCopyFromSelectedRange: changes => {
      dispatch(copyFromSelectedRange(changes, ownProps.schema, ownProps.lang))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)
