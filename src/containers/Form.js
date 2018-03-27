
import { connect } from 'react-redux'

import Form from '../components/form/Form.react'
import { actionCreators } from '../actions/form-actions'
import { updateItem } from '../actions/items-actions'

const mapStateToProps = (state, ownProps) => {
  return {
    showModal: state.form.showModal || false,
    selectedItem: state.form.selectedItem,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showFormModal: (document) => {
      dispatch(actionCreators.showFormModal(document))
    },
    hideFormModal: () => {
      dispatch(actionCreators.hideFormModal())
    },
    setChanges: (id, changes) => {
      // TO DO: put lang here correctly, as prop
      dispatch(updateItem(id, ownProps.schema, changes, 'en'))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)