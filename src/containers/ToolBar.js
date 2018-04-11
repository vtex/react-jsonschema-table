import { connect } from 'react-redux'
import FixedToolBar from '../components/fixedtoolbar/FixedToolbar.react'
import {
  addItem,
  exportCheckedItems,
  saveChanges,
  deleteCheckedItems,
  discardChanges,
} from '../actions/items-actions'
import {
  changeStagingFilter,
  changeInvalidItemsFilter,
  changeColumnVisibility,
  changeCheckedItemsFilter,
  viewAllColumns,
} from '../actions/filter-actions'
import uuid from 'uuid'

const mapStateToProps = (state, ownProps) => {
  return {
    context: ownProps.context,
    hasEditedItems:
      state.items.stagingItems && state.items.stagingItems.length > 0,
    hasInvalidItems:
      state.items.invalidItems && state.items.invalidItems.length > 0,
    hasCheckedItems:
      state.items.checkedItems && state.items.checkedItems.length > 0,
    isSelectedFilterActive: state.filter.isSelectedFilterActive,
    isStagingFilterActive: state.filter.isStagingFilterActive,
    isInvalidFilterActive: state.filter.isInvalidFilterActive,
    UIschema: ownProps.UIschema,
    schema: ownProps.schema,
    hiddenFields: state.filter.hiddenFields,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onExport: () => {
      dispatch(exportCheckedItems(uuid.v4(), ownProps.schema, ownProps.lang))
    },

    onSave: () => {
      dispatch(saveChanges(ownProps.UIschema, ownProps.context))
    },

    onAdd: () => {
      dispatch(addItem(uuid.v4(), ownProps.schema, ownProps.lang))
    },

    onDeleteCheckedRows: () => {
      dispatch(deleteCheckedItems())
    },

    onCancelStaging: () => {
      dispatch(discardChanges())
    },

    onChangeCheckedItemsFilter: () => {
      dispatch(changeCheckedItemsFilter())
    },

    onChangeStagingFilter: () => {
      dispatch(changeStagingFilter())
    },

    onChangeInvalidItemsFilter: () => {
      dispatch(changeInvalidItemsFilter())
    },

    onViewAllColumns: () => {
      dispatch(viewAllColumns())
    },

    onChangeColumnVisibility: (field, visible) => {
      dispatch(changeColumnVisibility(field, visible))
    },
  }
}

const ToolBar = connect(mapStateToProps, mapDispatchToProps)(FixedToolBar)

export default ToolBar
