import React from 'react'
import PropTypes from 'prop-types'

const FillHandle = function(props) {
  return (
    <div
      className="relative ba b--blue bg-lightest-blue relative z-999"
      style={{
        cursor: 'crosshair',
        width: '6px',
        height: '6px',
        marginTop: '-3px',
        marginLeft: '-3px',
        zIndex: 4,
        left: '100%',
      }}
      onMouseDown={props.onMouseDown}
    />
  )
}

FillHandle.propTypes = {
  onMouseDown: PropTypes.func,
}

export default FillHandle
