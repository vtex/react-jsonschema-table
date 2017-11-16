import '../css/fixedtoolbar.less'
import React from 'react'
import Actions from '../../../actions/Actions'
import PropTypes from 'prop-types'

var AndPrefix = 'AND'
var OrPrefix = 'OR'
class Prefix extends React.Component {
  render() {
    var returnValue = null
    var index = this.props.index
    var currentValue = this.props.currentValue

    if (index === 1) {
      returnValue = (
        <select
          className="prefix-select"
          defaultValue={currentValue}
          onChange={this.handleChangePrefix}
        >
          <option>{AndPrefix}</option>
          <option>{OrPrefix}</option>
        </select>
      )
    } else {
      returnValue = <label className="prefix">{currentValue}</label>
    }

    return returnValue
  }
  handleChangePrefix(ev) {
    Actions.changePrefixFilter(ev.target.value)
  }
}

Prefix.propTypes = {
  index: PropTypes.any,
  currentValue: PropTypes.any,
}

export default Prefix
