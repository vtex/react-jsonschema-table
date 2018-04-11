import React from 'react'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isEditing && !nextProps.isEditing && !nextProps.isFocus) {
      this.handleBlur()
    }
    if (
      this.props.isFocus &&
      typeof nextProps.userTypedText !== 'undefined' &&
      nextProps.userTypedText !== null
    ) {
      this.props.onEditCell()
    }
    this.setState({ value: nextProps.value })
  }

  componentDidUpdate(prevProps) {
    if (this.props.isEditing) {
      this.refTextArea.focus()
      if (
        !prevProps.isEditing &&
        typeof prevProps.userTypedText !== 'undefined' &&
        prevProps.userTypedText !== null
      ) {
        this.setState({ value: prevProps.userTypedText })
      }
    }
  }

  render() {
    const handlers = {
      moveUp: this.onArrow,
      moveDown: this.onArrow,
      moveRight: this.onArrow,
      moveLeft: this.onArrow,
      exitEdit: this.onEscape,
    }
    const borderColor = this.props.hasError ? 'b--red' : 'b--blue'
    const formBorderColor = this.props.hasError ? 'b--red' : 'b--moon-gray'

    var control = null
    if (this.props.isEditing) {
      control = (
        <HotKeys handlers={handlers} onBlur={this.handleBlur}>
          <textarea
            value={this.state.value}
            className={
              this.props.renderType === 'cell'
                ? `outline-0 relative z-3 w-100 h5 mt0 bw1 ba ${borderColor}`
                : `outline-0 w-100 h5 mt0 z-3 ba br3 pa3 ${formBorderColor}`
            }
            ref={ref => {
              this.refTextArea = ref
            }}
            onChange={this.handleChange}
          />
        </HotKeys>
      )
    } else {
      control = (
        <div
          className={`flex items-center w-100 ph4 h-inherit outline-0 ${this.props.isFocus ? `bw1 ba ${borderColor} bg-lightest-blue pl05 ` : this.props.hasError ? 'bw1 ba b--red pl05' : 'pl2'}`}
          ref={ref => {
            this.refTextArea = ref
          }}
          onDoubleClick={this.props.onEditCell}
          onKeyDown={this.handleKeyDown}
        >
          <div className="relative h-auto truncate">
            {this.state.value}
          </div>
        </div>
      )
    }
    return control
  }

  handleBlur = () => {
    if (this.props.value !== this.state.value) {
      this.props.setChange(this.state.value)
    }
  };

  onEscape = () => {
    if (this.props.isEditing) {
      if (this.props.value !== this.state.value) {
        this.props.setChange(this.state.value)
      }
      if (this.props.onExitEditCell) {
        this.props.onExitEditCell(this.props.cell)
      }
    }
  };

  onArrow = () => {};

  handleChange = e => {
    this.setState({ value: e.target.value })
  };
}

TextArea.propTypes = {
  hasError: PropTypes.bool,
  renderType: PropTypes.string,
  value: PropTypes.string,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  cell: PropTypes.object,
  onExitEditCell: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEdit: PropTypes.func,
  setChange: PropTypes.func,
  userTypedText: PropTypes.string,
}

export default TextArea
