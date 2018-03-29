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
        dialogClassName="absolute z-9999 left-2 w-30 overflow-auto bg-white ba b--moon-gray br3 bw1"
        onHide={this.handleHideDialog}
      >
        <div className="tc pa3">
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
        </div>
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
