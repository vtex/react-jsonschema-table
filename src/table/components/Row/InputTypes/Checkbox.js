import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'

import Toggle from '@vtex/styleguide/lib/Toggle'

class CheckBox extends React.Component {
  componentDidUpdate(prevProps) {
    const { isFocus, isEditing } = this.props

    if (isFocus && !prevProps.isFocus) {
      this.props.onEditCell()
    }

    if (isEditing && window && document) {
      ReactDOM.findDOMNode(this.el).focus()
    }
  }

  handleChange = e => {
    const { isEditing, setChange, value } = this.props

    e.preventDefault()
    if (isEditing) {
      setChange(!value)
    }
  }

  render() {
    const handlers = {
      space: this.handleChange,
      stageChanges: this.handleChange,
    }

    return (
      <HotKeys
        ref={el => {
          this.el = el
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
  onEditCell: PropTypes.func.isRequired,
  renderType: PropTypes.string,
  setChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
}

export default CheckBox
