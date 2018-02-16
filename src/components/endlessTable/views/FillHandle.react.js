import React from 'react'
import PropTypes from 'prop-types'
import '../css/fillHandle.less'

const FillHandle = function(props) {
  return <div className="fillHandle" onMouseDown={props.onMouseDown} />
}

FillHandle.propTypes = {
  onMouseDown: PropTypes.func,
}

export default FillHandle
