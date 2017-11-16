import React from 'react'
import ReactDOM from 'react-dom'
import DropdownList from 'react-widgets/lib/DropdownList'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
    this.onEnter = this.onEnter.bind(this)
  }

  componentDidUpdate() {
    if (!this.state.open) {
      ReactDOM.findDOMNode(this.dropdownlistcontainer).focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocus && !this.props.isFocus) {
      this.props.onEditCell()
    }
  }

  render() {
    const handlers = {
      stageChanges: this.onEnter,
    }
    const dropdownHandlers = {
      stageChanges: this.onCancelKey,
      moveUp: this.onCancelKey,
      moveDown: this.onCancelKey,
      moveRight: this.onCancelKey,
      moveLeft: this.onCancelKey,
    }
    // const borderColor = this.props.hasError ? 'b--red' : 'b--blue'
    const borderColor = this.props.renderType === 'cell'
      ? this.props.hasError ? 'b--red' : 'b--blue'
      : this.props.hasError ? 'b--red br3' : 'b--moon-gray br3'
    var control
    if (this.props.isFocus || this.props.isEditing) {
      control = (
        <HotKeys
          ref={ref => {
            this.dropdownlistcontainer = ref
          }}
          className={`flex items-center h-inherit bw1 ba edit-mode ${borderColor}`}
          handlers={handlers}
        >
          <HotKeys handlers={dropdownHandlers} className="h-inherit w-100">
            <DropdownList
              onToggle={this.handleToggle}
              open={this.state.open}
              defaultValue={null}
              data={this.props.enum}
              value={this.props.value}
              onChange={this.handleChange}
              filter="contains"
            />
          </HotKeys>
        </HotKeys>
      )
    } else {
      control = (
        <div
          ref={ref => {
            this.dropdownlistcontainer = ref
          }}
          className={
            this.props.hasError
              ? 'flex items-center w-100 h-inherit truncate ba bw1 b--red pl05'
              : 'flex items-center w-100 h-inherit truncate pl3'
          }
        >
          {this.props.value}
        </div>
      )
    }

    return control
  }
  handleChange = val => {
    this.props.setChange(val)
  };
  onCancelKey = () => {};
  onEnter = () => {
    this.setState({ open: true })
  };
  handleToggle = isOpen => {
    this.setState({ open: isOpen })
  };
}

Dropdown.propTypes = {
  hasError: PropTypes.bool,
  renderType: PropTypes.string,
  isFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  value: PropTypes.any,
  onEditCell: PropTypes.func,
  setChange: PropTypes.func,
  cell: PropTypes.object,
  enum: PropTypes.any,
}

export default Dropdown
