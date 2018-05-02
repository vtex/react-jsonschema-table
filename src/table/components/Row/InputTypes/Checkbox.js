import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'

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

  render() {
    const handlers = {
      stageChanges: this.handleChange,
      space: this.handleChange,
    }
    const borderColor = this.props.hasError ? 'b--red' : 'b--blue'
    const viewMode = this.props.hasError
      ? 'bw1 ba b--red h-100 pt05'
      : 'h-100 pt2 '

    return (
      <HotKeys
        ref={ref => {
          this.checkContainer = ref
        }}
        className={
          this.props.renderType !== 'cell'
            ? 'normal f3'
            : `w-100 h-100 tc ${
              this.props.isEditing
                ? `bw1 ba ${borderColor} h-100 pt05`
                : viewMode
            }`
        }
        handlers={handlers}
      >
        <input
          type="checkbox"
          onChange={this.handleChange}
          checked={this.props.value} />
      </HotKeys>
    )
  }

  handleChange = e => {
    e.preventDefault()
    if (this.props.isEditing) {
      this.props.setChange(!this.props.value)
    }
  }
}

CheckBox.propTypes = {
  renderType: PropTypes.string,
  hasError: PropTypes.bool,
  value: PropTypes.bool,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  setChange: PropTypes.func,
  onEditCell: PropTypes.func,
}

export default CheckBox
