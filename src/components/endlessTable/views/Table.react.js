import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import Rows from './Rows.react'
import Header from './Header.react'
import HeaderCell from './HeaderCell.react'
import PropTypes from 'prop-types'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollDiv: null,
    }
  }

  handleScroll = () => {
    if (window && document) {
      var header = ReactDOM.findDOMNode(this.header)
      var scrollDiv = ReactDOM.findDOMNode(this.scrollDiv)
      header.style.left = `-${scrollDiv.scrollLeft}px`
    }
  }

  handleScrollVertically = pixels => {
    if (window && document) {
      ReactDOM.findDOMNode(this.scrollDiv).scrollTop += pixels
    }
  }

  render() {
    var columns = []

    Object.keys(this.props.schema.properties).forEach(key => {
      if (this.props.hiddenFields.includes(key)) {
        return
      }
      columns.push(
        Object.assign({}, { fieldName: key }, this.props.schema.properties[key])
      )
    })

    return (
      <div className={this.props.form.showModal ? 'z-0' : ''}>
        <div className="mh4 overflow-hidden" style={{height: '39px'}}>
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
          className="fixed overflow-scroll h-100 w-100 mh4 mb7 ph2"
          id="listContainer"
          onScroll={this.handleScroll}
          ref={div => {
            this.scrollDiv = div
            !this.state.scrollDiv && this.setState({scrollDiv: div})
          }}
        >
          {this.state.scrollDiv
            ? <HotKeys className="list">
                <Rows
                  onGetNotLoadedDocument={this.handleFetchItems}
                  onScroll={this.handleScrollVertically}
                  onCheckRow={this.props.onCheckRow}
                  columns={columns}
                  listContainer={this.state.scrollDiv}
                  {...this.props}
                />
              </HotKeys>
            : null //loader
          }
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
      this.props.UIschema.fields,
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
        if (this.props.hiddenFields.includes(key)) {
          return
        }
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
  onEditItem: PropTypes.func,
  context: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  UIschema: PropTypes.object.isRequired,
  onCheckRow: PropTypes.func,
  fetchSize: PropTypes.number,
  where: PropTypes.string,
  sort: PropTypes.string,
  onFetchItems: PropTypes.func.isRequired,
  hiddenFields: PropTypes.array,
}

export default Table
