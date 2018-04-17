import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Multiselect from 'react-widgets/lib/Multiselect'
import { HotKeys } from 'react-hotkeys'
import SelectedItem from './SelectedItem.react'
import ListOption from './ListOption.react'

class MultiOptions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.isEditing && !prevProps.isEditing) {
      // ReactDOM.findDOMNode(this.multiSelect).focus()
      if (this.multiSelect && this.multiSelect.focus) {
        this.multiSelect.focus()
      } else { console.log('No multiSelect to focus on Multioptions.react.js') }
    }
  }
  render() {
    const multiSelectHandlers = {
      stageChanges: this.handleEnter,
      moveDown: this.onCancelKey,
      moveUp: this.onCancelKey,
      moveLeft: this.onCancelKey,
      moveRight: this.onCancelKey,
    }
    const border = this.props.renderType === 'cell'
      ? `bw1 ba ${this.props.hasError ? 'b--red ' : 'b--blue '}`
      : `bw1 ba ${this.props.hasError ? 'b--red br3 ' : 'b--moon-gray br3 '}`
    var control = null
    var value = this.props.value ? this.props.value : []
    if (this.props.isEditing || this.props.isFocus) {
      control = (
        <HotKeys
          className={
            `${border
            } flex items-center bg-white w-100 relative z-999`
          }
          handlers={multiSelectHandlers}
          onClick={this.handleClick}
        >
          <Multiselect
            placeholder="selecione uma opção"
            ref={ref => {
              this.multiSelect = ref
            }}

            open={this.state.open}
            onToggle={this.handleToggle}
            data={this.props.items.enum}
            tagComponent={SelectedItem}
            itemComponent={ListOption}
            value={value}
            onChange={this.handleChange}
          />
        </HotKeys>
      )
    } else {
      control = (
        <div
          className={
            this.props.hasError
              ? 'flex items-center w-100 h-inherit truncate outline-0 pa bw1 b--red pl05 '
              : 'flex items-center w-100 h-inherit truncate outline-0 pl3'
          }
        >
          {value.length ? value.join(', ') : ''}
        </div>
      )
    }
    return control
  }
  onCancelKey = () => {};
  handleChange = val => {
    this.props.setChange(val)
  };
  handleToggle = isOpen => {
    if (this.props.isEditing) {
      this.setState({ open: isOpen })
    }
  };
  handleClick = () => {
    if (!this.props.isEditing) {
      this.props.onEditCell()
    }
  };
  handleEnter = e => {
    if (!this.props.isEditing) {
      this.props.onEditCell()
    } else {
      if (!this.state.open) {
        e.stopPropagation()
        this.setState({ open: true })
      }
    }
  };
  handleCancelKey = () => {};
}
MultiOptions.propTypes = {
  hasError: PropTypes.bool,
  renderType: PropTypes.string,
  value: PropTypes.array,
  onEditCell: PropTypes.func,
  setChange: PropTypes.func,
  isEditing: PropTypes.bool,
  items: PropTypes.object,
  isFocus: PropTypes.bool,
}

MultiOptions.defaultProps = {
  value: [],
}

export default MultiOptions
