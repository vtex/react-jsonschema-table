import React from 'react'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { HotKeys } from 'react-hotkeys'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

momentLocalizer(Moment)

class DateTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: props.value ? new Date(props.value) : null,
    }
  }

  componentDidUpdate() {
    if (this.props.isEditing && window && document) {
      ReactDOM.findDOMNode(this.picker).focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    var value = nextProps.value ? nextProps.value : null
    this.setState({ value: value })
  }

  render() {
    const handlers = {
      moveUp: this.onArrow,
      moveDown: this.onArrow,
      moveRight: this.onArrow,
      moveLeft: this.onArrow,
    }
    const borderColor = this.props.renderType === 'cell'
      ? this.props.hasError ? 'b--red' : 'b--blue'
      : this.props.hasError ? 'b--red br3' : 'b--moon-gray br3'
    return (
      <HotKeys
        ref={ref => {
          this.pickerContainer = ref
        }}
        className={
          this.props.isEditing
            ? ` w-100 bw1 ba ${borderColor} h-inherit edit-mode`
            : `flex items-center h-inherit w-100 view-mode${
              this.props.isFocus
                ? ` bw1 ba ${
                  borderColor
                } bg-lightest-blue selected-view-mode`
                : this.props.hasError ? 'bw1 ba b--red' : ''}`
        }
        // onBlur={this.handleBlur}
        onDoubleClick={this.props.onEditCell}
        handlers={handlers}
      >
        <DateTimePicker
          ref={ref => {
            this.picker = ref
          }}
          format={'llll'}
          value={this.state.date}
          defaultValue={null}
          onChange={this.handleChange}
          date={this.props.isEditing}
          time={this.props.isEditing}
          readOnly={!this.props.isEditing}
        />
      </HotKeys>
    )
  }

  handleBlur = () => {
    const newValue = this.state.date ? this.state.date.toISOString() : ''
    if (
      (!this.props.value && !this.state.date) || newValue === this.props.value
    ) {
      return
    }
    this.props.setChange(newValue)
  };

  handleChange = (date, dateStr) => {
    const newValue = date ? date.toISOString() : ''
    this.setState({ date: date, dateStr: dateStr })
    this.props.setChange(newValue)
  };

  onEnter = () => {
    if (this.props.isEditing) {
      this.props.setChange(this.state.value)
      if (this.props.onExitEditCell) {
        this.props.onExitEditCell(this.props.cell)
      }
    }
  };

  onArrow = () => {};
}

DateTime.propTypes = {
  hasError: PropTypes.bool,
  renderType: PropTypes.string,
  isFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  value: PropTypes.any,
  onExitEditCell: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEdit: PropTypes.func,
  setChange: PropTypes.func,
  cell: PropTypes.object,
}

export default DateTime
