import React from 'react'
import PropTypes from 'prop-types'

class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  render() {
    return (
      <div className="dtc nowrap w1">
        <div className="pv1 ph3 br3 bg-blue white mr3">
          {`${this.props.filter.logicalOp} ${this.props.filter.field} ${
            this.props.filter.comparisonOp
          } ${this.props.filter.value}`}
          <div className="pl3 dib">
            <i
              className="fa fa-times pointer"
              aria-hidden="true"
              onClick={this.handleClick}
            />
          </div>
        </div>
      </div>
    )
  }
  handleClick() {
    this.props.onDelete(this.props.index)
  }
}

Filter.propTypes = {
  filter: PropTypes.object,
  index: PropTypes.number,
  onDelete: PropTypes.func,
}

export default Filter
