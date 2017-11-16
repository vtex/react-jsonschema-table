import React from 'react'
import PropTypes from 'prop-types'

class Icon extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return <i className={this.props.className} onClick={this.handleClick} />
  }

  handleClick() {
    if (this.props.onClick)this.props.onClick(this.props.id)
  }
}

Icon.propTypes = {
  id: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default Icon
