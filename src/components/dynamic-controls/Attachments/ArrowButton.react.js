import React from 'react'
import PropTypes from 'prop-types'

class ArrowButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <button
        onClick={this.handleClick}
        className={this.props.className}
        // style={this.props.style}
      />
    )
  }

  handleClick(e) {
    this.props.onClick(e)
  }
}

ArrowButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  // style: PropTypes.object,
}

export default ArrowButton
