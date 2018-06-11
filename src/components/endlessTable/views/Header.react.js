import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHoveringIndexHeaderCell: false
    }
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
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
    const { isHoveringIndexHeaderCell } = this.state
    const { checkedItems, items } = this.props
    const areAllRowsChecked = !!(checkedItems.length >= items.length)

    return (
      <div
        className="relative inline-flex pt1 mt0"
        style={this.getInlineStyle()}
      >
        <div className="pt1 flex dib">
          <div
            className="flex items-center justify-center bg-near-white ba b--silver"
            style={{ width: '50px', height: '35px' }}
            onMouseEnter={() => this.setState({ isHoveringIndexHeaderCell: true })}
            onMouseLeave={() => this.setState({ isHoveringIndexHeaderCell: false })}
          >
            <div className="flex items-center justify-center">
              <input
                  type="checkbox"
                  title={areAllRowsChecked ? 'Uncheck All' : 'Check All'}
                  className={this.props.isChecking || isHoveringIndexHeaderCell ? '' : 'dn' }
                  checked={areAllRowsChecked}
                  onChange={areAllRowsChecked ? this.handleClearCheckedRows : this.handleCheckAllRows}
                />
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }

  handleClearCheckedRows = () => {
    this.props.onCheckRowChange(null, false)
  }

  handleCheckAllRows = () => {
    this.props.onCheckRowChange(null, true)
  }

  getInlineStyle = () => {
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
  onCheckRowChange: PropTypes.func,
  scrollLeft: PropTypes.number,
  isChecking: PropTypes.bool,
  children: PropTypes.any,
}

export default Header
