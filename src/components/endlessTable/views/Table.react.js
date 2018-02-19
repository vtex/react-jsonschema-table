import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import Rows from './Rows.react'
import Header from './Header.react'
import HeaderCell from './HeaderCell.react'
import PropTypes from 'prop-types'
import '../css/endless-table.less'

class Table extends React.Component {
  handleScroll = () => {
    var header = ReactDOM.findDOMNode(this.header)
    var scrollDiv = ReactDOM.findDOMNode(this.scrollDiv)
    header.style.left = `-${scrollDiv.scrollLeft}px`
  }

  handleScrollVertically = pixels => {
    ReactDOM.findDOMNode(this.scrollDiv).scrollTop += pixels
  }

  render() {
    var columns = []

    Object.keys(this.props.schema.properties).forEach(key => {
      columns.push(
        Object.assign({}, { fieldName: key }, this.props.schema.properties[key])
      )
    })

    return (
      <div>
        <div className="mh4 ph2 overflow-hidden">
          <Header
            onCheckRow={this.props.onCheckRow}
            {...this.props}
            ref={ref => {
              this.header = ref
            }}
          >
            {this.getHeader()}
          </Header>
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
              onGetNotLoadedDocument={this.handleFetchItems}
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

  scrollToEnd = () => {
    var scrollDiv = this.scrollDiv
    scrollDiv.scrollTop = scrollDiv.scrollHeight
  }

  handleFetchItems = skip => {
    this.props.onFetchItems(
      this.props.context,
      this.props.UISchema.fields,
      skip,
      this.props.fetchSize || 100,
      this.props.where,
      this.props.sort
    )
  }

  getHeader() {
    const that = this
    const header = []
    const schema = this.props.schema
    if (schema) {
      Object.keys(schema.properties).forEach((key, index) => {
        var fieldDef = schema.properties[key]
        var label = (
          <div>
            {/* <i className={`contenTypeIcon fa fa-${fieldDef.icon}`} /> */}
            {fieldDef.title || key}
          </div>
        )
        if (!fieldDef.width) {
          fieldDef.width = 200
        }
        header.push(
          <HeaderCell
            index={index}
            key={key}
            value={label}
            {...fieldDef}
            fieldName={key}
            onHandleSort={that.handleSort}
          />
        )
      })
    }

    return header
  }
}

Table.propTypes = {
  context: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  UISchema: PropTypes.object.isRequired,
  onCheckRow: PropTypes.func,
  fetchSize: PropTypes.number,
  where: PropTypes.string,
  sort: PropTypes.string,
  onFetchItems: PropTypes.func.isRequired,
}

export default Table