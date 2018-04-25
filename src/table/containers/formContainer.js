import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updateItem } from 'actions/items-actions'
import { actionCreators } from 'table/actions'
import Form from 'table/components/Row/Form'

const mapStateToProps = state => {
  return {
    showModal: state.form.showModal || false,
    selectedItem: state.form.selectedItem,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const bindedActions = bindActionCreators(actionCreators, dispatch)

  return {
    ...bindedActions,
    setChanges: (id, changes) => {
      // TO DO: put lang here correctly, as prop
      dispatch(updateItem(id, ownProps.schema, changes, 'en'))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
