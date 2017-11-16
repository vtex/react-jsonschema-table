import '../css/fixedtoolbar.less'
import React from 'react'
import PropTypes from 'prop-types'

import Actions from '../../../actions/Actions'

class Value extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  render() {
    return (
      <input type="text" className="valueInput" onChange={this.handleChange} />
    )
  }

  handleChange() {
    Actions.changeValueFilter(this, this.props.virtualID)
  }
}

Value.propTypes = {
  virtualID: PropTypes.string,
}

export default Value
