import React from 'react'
import '../css/fillHandle.less'

const FillHandle = function(props) {
  return <div className="fillHandle" onMouseDown={props.onMouseDown} />
}

FillHandle.propTypes = {
  onMouseDown: React.PropTypes.func,
}

export default FillHandle
