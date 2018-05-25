import React from 'react'
// import { ReactDatez } from 'react-datez'
// import 'react-datez/dist/css/react-datez.css'
import { HotKeys } from 'react-hotkeys'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import moment from 'moment'

class DateTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: props.value ? new Date(props.value) : null,
      dateStr: props.value ? this.prettierDate(props.value) : '',
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

  prettierDate(date) {
    return moment(date).format('MM-DD-YYYY').replace(/-/g, '/')
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
      : this.props.hasError ? 'b--red br3' : 'b--silver br3'
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
        <div className="w-100 flex items-center h-inherit ph4">
          {/* <ReactDatez
            ref={ref => {
              this.picker = ref
            }}
            inputStyle={{ width: '100%', marginLeft: '5px' }}
            allowPast
            value={this.state.date}
            handleChange={this.handleChange}
          /> */}
          <input
            className={`w-100 bn pl05 outline-0 ${
              this.props.isEditing || this.props.isFocus
              ? 'bg-washed-blue'
              : ''
            }`}
            value={this.state.dateStr}
            ref={ref => {
              this.picker = ref
            }}
            onChange={this.handleChange}
            onClick={this.handleInputClick}
            onBlur={this.handleBlur}
          />
        </div>
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

  // handleChange = (date, dateStr) => {

  //   const selecteddate = date ? new Date(date) : ''
  //   const newValue = selecteddate ? selecteddate.toISOString() : ''

  //   this.setState({ date: date, dateStr: newValue })
  //   this.props.setChange(newValue)
  // };

  handleChange = (e) => {
    const typedDate = e.target.value

    const selecteddate = typedDate ? new Date(typedDate) : typedDate

    this.setState({ date: selecteddate, dateStr: typedDate })
    this.props.setChange(typedDate)
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
