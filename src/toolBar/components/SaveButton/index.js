import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

class SaveButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSaving: false,
    }
  }

  render() {
    const { customStyle, hasEditedItems } = this.props
    if (!hasEditedItems) return null
    return (
      <div
        className={`pv2 br3 ph2 inline-flex nowrap ${
          this.props.disabled || this.state.isSaving
            ? 'cursor-not-allowed o-30 '
            : 'pointer'
        }`}
        onClick={this.handleClick}
        style={customStyle || {}}
      >
        <i className={`fa fa-save pr2 ${customStyle ? '' : 'blue'}`} />
        <div className={`dn di-l ${customStyle ? '' : 'blue'}`}>
          <FormattedMessage
            id={this.state.isSaving
            ? 'FixedToolbar.saving'
            : 'FixedToolbar.save'} />
        </div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: nextProps.disabled })
  }

  handleClick = () => {
    if (this.props.disabled || this.state.isSaving) {
      return
    }
    this.props.handleSaveAll()
  }
}

SaveButton.propTypes = {
  handleSaveAll: PropTypes.func,
  disabled: PropTypes.bool,
  customStyle: PropTypes.object,
  hasEditedItems: PropTypes.bool,
}

export default SaveButton
