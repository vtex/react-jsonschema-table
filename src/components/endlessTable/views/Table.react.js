import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { HotKeys } from 'react-hotkeys'
import Rows from './Rows.react'
import Header from './Header.react'
import PropTypes from 'prop-types'
import '../css/endless-table.less'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.handleScrollVertically = this.handleScrollVertically.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.onFocusCell = this.onFocusCell.bind(this)
    this.onEditCell = this.onEditCell.bind(this)
    this.onExitEditCell = this.onExitEditCell.bind(this)
    this.onFocusCell = this.onFocusCell.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
    this.state = {
      focusedCell: null,
      editingCell: null,
      cellSelectionRange: {
        rowStart: null,
        rowEnd: null,
        colStart: null,
        colEnd: null,
      },
    }
  }

  handleScroll() {
    var header = ReactDOM.findDOMNode(this.header)
    var scrollDiv = ReactDOM.findDOMNode(this.scrollDiv)
    header.style.left = `-${scrollDiv.scrollLeft}px`
  }

  handleScrollVertically(pixels) {
    ReactDOM.findDOMNode(this.scrollDiv).scrollTop += pixels
  }

  render() {
    var columns = []
    if (this.props.children) {
      this.props.children.map(function(item) {
        columns.push(_.extend({ fieldName: item.key }, item.props))
      })
    }
    return (
      <div>
        <div className="mh4 ph2 overflow-hidden">
          <Header
            children={this.props.children}
            onCheckRow={this.props.onCheckRow}
            {...this.props}
            ref={ref => {
              this.header = ref
            }}
          />
        </div>
        <div
          className="scroolOverlayInner mh4 ph2"
          id="listContainer"
          onScroll={this.handleScroll}
          ref={div => {
            this.scrollDiv = div
          }}
        >
          <HotKeys className="list">
            <Rows
              onGetNotLoadedDocument={this.props.onGetNotLoadedDocument}
              onGetItemOptions={this.props.onGetItemOptions}
              renderValue={this.props.renderValue}
              onScroll={this.handleScrollVertically}
              onCheckRow={this.props.onCheckRow}
              columns={columns}
              {...this.props}
            />
          </HotKeys>
        </div>
      </div>
    )
  }
  onFocusCell(cell) {
    this.setState({ focusedCell: cell, editingCell: null })
  }
  onEditCell(cell) {
    this.setState({ editingCell: cell })
  }
  onExitEditCell(cell) {
    if (_.isEqual(cell, this.state.editingCell)) {
      this.setState({ editingCell: null })
    }
  }
  onSelectCell() {}
  scrollToEnd() {
    var scrollDiv = this.scrollDiv
    scrollDiv.scrollTop = scrollDiv.scrollHeight
  }
}

Table.propTypes = {
  onCheckRow: PropTypes.func,
  renderValue: PropTypes.func,
  onGetItemOptions: PropTypes.func,
  onGetNotLoadedDocument: PropTypes.func,
  children: PropTypes.any,
}

export default Table
