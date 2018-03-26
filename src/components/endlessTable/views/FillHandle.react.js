import React from 'react'
import PropTypes from 'prop-types'
import '../css/fillHandle.less'

const FillHandle = function(props) {
  return (
    <div
      className="fillHandle ba b--blue bg-lightest-blue relative z-999"
      onMouseDown={props.onMouseDown}
    />
  )
}

FillHandle.propTypes = {
  onMouseDown: PropTypes.func,
}

export default FillHandle
