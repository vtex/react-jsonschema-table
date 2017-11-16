import '../css/header.less'
import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
    this.handleClearCheckedRows = this.handleClearCheckedRows.bind(this)
    this.getInlineStyle = this.getInlineStyle.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    var shouldUpdate = false

    shouldUpdate = this.props.context !== nextProps.context
    if (shouldUpdate) {
      return shouldUpdate
    }

    shouldUpdate = this.props.isChecking !== nextProps.isChecking
    if (shouldUpdate) {
      return shouldUpdate
    }

    shouldUpdate =
      this.props.children &&
      nextProps.children &&
      this.props.children.length !== nextProps.children.length

    // return shouldUpdate
    return true
  }

  render() {
    return (
      <div className="list-header" style={this.getInlineStyle()}>
        <div className="list-row-header">
          <div className="first-cell flex items-center justify-center">
            {this.props.isChecking
              ? <input
                type="checkbox"
                title="Limpar seleção"
                checked={this.props.isChecking}
                onChange={this.handleClearCheckedRows}
              />
              : ''}
          </div>
          <div className="row-menu-button" />
          {this.props.children}
        </div>
      </div>
    )
  }

  handleClearCheckedRows() {
    this.props.onCheckRow(this.props.context, null, false)
  }

  getInlineStyle() {
    var style = {}
    var scrollLeft = this.props.scrollLeft
    if (scrollLeft) {
      style.left = `${scrollLeft * -1}px`
    }
    return style
  }
}
Header.propTypes = {
  context: PropTypes.object,
  onCheckRow: PropTypes.func,
  scrollLeft: PropTypes.number,
  isChecking: PropTypes.bool,
  children: PropTypes.any,
}

export default Header
