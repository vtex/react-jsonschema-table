import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import ControlFactory from '../../dynamic-controls/ControlFactory.react'
import { HotKeys } from 'react-hotkeys'
import FillHandle from './FillHandle.react'
import { Overlay, Popover } from 'react-bootstrap'

class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userTypedText: null }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isFocus !== nextProps.isFocus ||
      this.props.isEditing !== nextProps.isEditing ||
      this.props.value !== nextProps.value ||
      this.props.isSelected !== nextProps.isSelected ||
      this.props.isFillHandleSelected !== nextProps.isFillHandleSelected ||
      nextState.userTypedText !== this.state.userTypedText ||
      this.props.isFillHandleCell !== nextProps.isFillHandleCell
    )
  }

  componentWillReceiveProps() {
    this.setState({ userTypedText: null })
  }

  componentDidUpdate() {
    if (this.props.isFocus && !this.props.isEditing) {
      ReactDom.findDOMNode(this.cellControl).focus()
    }
  }

  render() {
    const fillHandle = this.props.isFillHandleCell && !this.props.isEditing
      ? <FillHandle onMouseDown={this.props.onFillHandleDown} />
      : null
    const sharedProps = {
      show: this.props.isFocus && this.props.validationErrors.length > 0,
      target: () => this.cellControl,
    }
    const popover = (
      <Overlay
        {...sharedProps}
        placement={
          this.props.columnsCount - 1 === this.props.cell.col ? 'left' : 'right'
        }
      >
        <Popover
          id="popover-basic"
          title={this.getI18nStr('Cell.validation.error')}
          className="z-999"
        >
          {this.props.validationErrors.length > 0
            ? this.props.validationErrors[0].message
            : ''}
        </Popover>
      </Overlay>
    )
    return (
      <HotKeys
        className={
          (this.props.cell.col === 0
            ? 'relative h-100'
            : 'relative h-100 bl b--moon-gray') +
            (this.props.isSelected ? ' bg-lightest-blue' : '') +
            (this.props.isFillHandleSelected ? ' bg-near-white' : '')
        }
        style={this.getInlineStyle(this.props.width)}
        onMouseDown={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onKeyPress={this.handleKeyPress}
        onMouseEnter={this.handleMouseEnter}
        ref={ref => {
          this.cellControl = ref
        }}
        id={'row' + this.props.cell.row + 'col' + this.props.cell.col}
      >
        <ControlFactory
          {...this.props}
          onEditCell={this.handleEditCell}
          onExitEdit={this.handleExitEditCell}
          onFocus={this.handleFocus}
          userTypedText={this.state.userTypedText}
          renderType={'cell'}
          ref={ref => {
            this.controlFactory = ref
          }}
        >
          {fillHandle}
        </ControlFactory>
        {popover}
      </HotKeys>
    )
  }

  getInlineStyle(width) {
    var style = {}
    if (width) {
      style.width = width + 'px'
      style.maxWidth = width + 'px'
    }

    return style
  }

  handleFocus = () => {
    console.log('mouseDown')
    if (this.props.onFocusCell && !this.props.isFocus) {
      this.props.onFocusCell(this.props.cell)
    }
  };

  handleKeyPress = e => {
    if (this.props.isEditing) return
    var regex = new RegExp('^[a-zA-Z0-9]+$')
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    if (regex.test(str) || e.charCode === 32) {
      e.preventDefault()
      this.setState({ userTypedText: str })
    }
  };

  handleKeyDown = e => {
    if (this.props.isEditing) return
    if (e.which === 8 || e.charCode === 8) {
      e.preventDefault()
      this.setState({ userTypedText: '' })
    }
  };

  handleMouseEnter = () => {
    if (this.props.onSelectCell) {
      this.props.onSelectCell(this.props.cell)
    }
  };

  handleEditCell = () => {
    if (!this.props.isEditing && this.props.onEditCell) {
      this.props.onEditCell(this.props.cell)
    }
  };

  handleExitEditCell = () => {
    if (this.props.onExitEditCell) {
      this.props.onExitEditCell(this.props.cell)
    }
  };

  getI18nStr(id) {
    return this.context.intl.formatMessage({ id: id })
  }
}
Cell.contextTypes = {
  intl: PropTypes.object.isRequired,
}

Cell.propTypes = {
  validationErrors: PropTypes.array,
  columnsCount: PropTypes.number,
  value: PropTypes.any,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  isSelected: PropTypes.bool,
  isFillHandleCell: PropTypes.bool,
  isFillHandleSelected: PropTypes.bool,
  cell: PropTypes.object,
  id: PropTypes.string,
  onSelectCell: PropTypes.func,
  onFocusCell: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEditCell: PropTypes.func,
  onFillHandleDown: PropTypes.func,
  width: PropTypes.number,
}

export default Cell
