import React from 'react'
import PropTypes from 'prop-types'

class AutoCompleteOption extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <div
        className={`w-100 pl3 pr3 pointer ${
          this.props.selected ? 'light-blue bg-light-gray' : ''
        }`}
        onClick={this.handleClick}
      >
        {this.props.value}
      </div>
    )
  }

  handleClick() {
    this.props.onSelect(this.props.value)
  }
}

AutoCompleteOption.propTypes = {
  value: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
}

export default AutoCompleteOption
