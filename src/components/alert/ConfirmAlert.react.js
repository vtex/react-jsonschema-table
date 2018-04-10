import React from 'react'
import Modal from '@vtex/styleguide/lib/Modal'
import Button from '@vtex/styleguide/lib/Button'
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
        centered
        isOpen={this.state.show}
        onClose={this.handleHideDialog}
      >
        <div className="flex flex-column tc pa3">
          <div className="f3">
            <FormattedMessage id="ConfirmAlert.title" />
          </div>
          <div>{this.props.message}</div>
          <div className="tr">
            <span className="mr4">
              <Button primary onClick={this.props.onConfirm}>
                <FormattedMessage id="ConfirmAlert.footer.yes" />
              </Button>
            </span>
            <span>
              <Button secondary onClick={this.handleHideDialog}>
                <FormattedMessage id="ConfirmAlert.footer.no" />
              </Button>
            </span>
          </div>
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
