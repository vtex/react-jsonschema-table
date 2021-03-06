import React from 'react'
import PropTypes from 'prop-types'

const SelectedItem = function(props) {
  return (
    <span className="mr1">
      {props.item}
    </span>
  )
}
SelectedItem.propTypes = {
  item: PropTypes.string,
}
export default SelectedItem
