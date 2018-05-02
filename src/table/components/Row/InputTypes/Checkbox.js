import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'

import Toggle from '@vtex/styleguide/lib/Toggle'

class Checkbox extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isChecked: !!props.value }
  }

  componentDidUpdate(prevProps) {
    const { isFocus, isEditing } = this.props

    if (isFocus && !prevProps.isFocus) {
      this.props.onEditCell()
    }

    if (isEditing && window && document) {
      ReactDOM.findDOMNode(this.el).focus()
    }

    if (prevProps.value !== this.props.value) {
      this.setState({ isChecked: !!this.props.value })
    }
  }

  handleChange = e => {
    const { isEditing, setChange } = this.props

    e.preventDefault()

    if (isEditing) {
      setChange(!this.state.isChecked)

      this.setState({ isChecked: !this.state.isChecked })
    }
  }

  render() {
    const { isChecked } = this.state
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
        <div style={{ transform: 'scale(0.7)' }}>
          <Toggle checked={isChecked} onChange={this.handleChange} />
        </div>
      </HotKeys>
    )
  }
}

Checkbox.propTypes = {
  hasError: PropTypes.bool,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  onEditCell: PropTypes.func,
  renderType: PropTypes.string,
  setChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
}

export default Checkbox
