import React from 'react'
import PropTypes from 'prop-types'

const ListOption = function(props) {
  return (
    <span className="cursor-default">
      {props.item}
    </span>
  )
}
ListOption.propTypes = {
  item: PropTypes.string,
}
export default ListOption
