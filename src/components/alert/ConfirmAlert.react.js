import './css/confirmAlert.less'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

class ConfirmAlert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true,
    }
    this.handleHideDialog = this.handleHideDialog.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show })
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        bsStyle="warning"
        autoFocus
        bsSize="sm"
        onHide={this.handleHideDialog}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">
            <FormattedMessage id="ConfirmAlert.title" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.message}</Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.props.onConfirm}>
            <FormattedMessage id="ConfirmAlert.footer.yes" />
          </Button>
          <FormattedMessage id="ConfirmAlert.footer.or" />
          <Button onClick={this.handleHideDialog}>
            <FormattedMessage id="ConfirmAlert.footer.no" />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleHideDialog() {
    this.setState({ show: false })
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }
}

ConfirmAlert.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  message: PropTypes.object,
  show: PropTypes.bool,
}

export default ConfirmAlert
