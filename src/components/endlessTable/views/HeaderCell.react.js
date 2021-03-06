import React from 'react'
import PropTypes from 'prop-types'

class HeaderCell extends React.Component {
  constructor(props) {
    super(props)
    this._getInlineStyle = this._getInlineStyle.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleSortAsc = this.handleSortAsc.bind(this)
    this.handleSortDesc = this.handleSortDesc.bind(this)
    this.state = { sort: 'ASC', sortIcon: 'asc', inactive: true }
  }

  render() {
    return (
      <div
        className={`flex items-center justify-center ph2 pv2 h-100 bg-near-white bb bt b--silver${
          this.props.index === 0 ? ' ' : ' bl'
        }${this.props.lastCellIndex === this.props.index ? ' br' : ' '}`}
        style={this._getInlineStyle()}
      >
        <div className="fl fw5 w-90 truncate">{this.props.value.props.children}</div>
        {this.props.isIndex && this.props.type !== 'object' ? (
          this.state.inactive ? (
            <div className="fl w-10 tc lh-solid">
              <div className="center relative">
                <i
                  className={`${'fa fa-sort-asc pointer fa-lg '}${
                    this.state.inactive ? 'o-70' : ''
                  }`}
                  onClick={this.handleSortAsc}
                />
              </div>
              <div className="center relative mt2 bottom-1">
                <i
                  className={`${'fa fa-sort-desc pointer fa-lg '}${
                    this.state.inactive ? 'o-70' : ''
                  }`}
                  onClick={this.handleSortDesc}
                />
              </div>
            </div>
          ) : (
            <div className="center relative">
              <i
                className={
                  this.state.sort === 'ASC'
                    ? 'fa fa-sort-asc pointer fa-lg mt3'
                    : 'fa fa-sort-desc pointer fa-lg'
                }
                onClick={this.handleSort}
              />
            </div>
          )
        ) : null}
      </div>
    )
  }
  handleSortAsc() {
    this.props.onHandleSort(this.props.fieldName, 'ASC')
    this.setState({ sort: 'ASC', sortIcon: 'asc', inactive: false })
  }
  handleSortDesc() {
    this.props.onHandleSort(this.props.fieldName, 'DESC')
    this.setState({ sort: 'DESC', sortIcon: 'desc', inactive: false })
  }

  handleSort() {
    if (this.state.sort === 'ASC') {
      this.props.onHandleSort(this.props.fieldName, 'DESC')
      this.setState({ sort: 'DESC', sortIcon: 'desc', inactive: false })
    } else {
      this.props.onHandleSort(this.props.fieldName, 'ASC')
      this.setState({ sort: 'ASC', sortIcon: 'asc', inactive: false })
    }
  }

  _getInlineStyle() {
    var style = {}
    if (this.props.width) {
      style.width = `${this.props.width}px`
      style.maxWidth = `${this.props.width}px`
      style.height = '35px'
    }

    return style
  }
}

HeaderCell.propTypes = {
  width: PropTypes.any,
  value: PropTypes.object,
  isIndex: PropTypes.bool,
  fieldName: PropTypes.string,
  onHandleSort: PropTypes.func,
  type: PropTypes.string,
  index: PropTypes.number,
  lastCellIndex: PropTypes.number,
}

export default HeaderCell
