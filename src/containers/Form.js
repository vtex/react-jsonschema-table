
import { connect } from 'react-redux'

import Form from '../components/form/Form.react'
import { actionCreators } from '../actions/form-actions'

const mapStateToProps = (state, ownProps) => {
  return {
    showModal: state.form.showModal || false,
    selectedItem: state.form.selectedItem,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showFormModal: (document) => {
      dispatch(actionCreators.showFormModal(document))
    },
    hideFormModal: () => {
      dispatch(actionCreators.hideFormModal())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)