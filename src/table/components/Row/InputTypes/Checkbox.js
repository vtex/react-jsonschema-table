import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'

import Toggle from '@vtex/styleguide/lib/Toggle'

class CheckBox extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocus && !this.props.isFocus) {
      this.props.onEditCell()
    }
  }

  componentDidUpdate() {
    if (this.props.isEditing && window && document) {
      ReactDOM.findDOMNode(this.checkContainer).focus()
    }
  }

  handleChange = e => {
    e.preventDefault()
    if (this.props.isEditing) {
      this.props.setChange(!this.props.value)
    }
  }

  render() {
    const handlers = {
      space: this.handleChange,
      stageChanges: this.handleChange,
    }

    return (
      <HotKeys
        ref={ref => {
          this.checkContainer = ref
        }}
        className={`w-100 h-100 flex items-center justify-center outline-0 ${
          this.props.isFocus ? 'bw1 ba b--blue' : ''
        }`}
        handlers={handlers}
      >
        <Toggle checked={this.props.value} onClick={this.handleChange} />
      </HotKeys>
    )
  }
}

CheckBox.propTypes = {
  hasError: PropTypes.bool,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  onEditCell: PropTypes.func,
  renderType: PropTypes.string,
  setChange: PropTypes.func,
  value: PropTypes.bool,
}

export default CheckBox
