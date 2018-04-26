import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ToolBar from 'toolBar/components/ToolBar'
import {
  addItem,
  exportCheckedItems,
  saveChanges,
  deleteCheckedItems,
  discardChanges,
} from 'actions/items-actions'
import { actionCreators } from 'toolBar/actions'
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
    items: state.items,
    stagingItemsCallback: ownProps.stagingItemsCallback,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const bindedActions = bindActionCreators(actionCreators, dispatch)
  return {
    ...bindedActions,

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)
