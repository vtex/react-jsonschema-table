import React from 'react'
import PropTypes from 'prop-types'

class Card extends React.Component {
  render() {
    const values = []
    if (typeof this.props.displayValue === 'object') {
      values.push(this.renderObjectValues(this.props.displayValue))
    } else {
      values.push(this.props.displayValue)
    }
    return (
      <div onClick={this.handleClick} className={this.props.className}>
        {values}
        {this.props.children}
      </div>
    )
  }

  renderObjectValues(value) {
    const values = []
    Object.keys(value).forEach(key => {
      if (value[key] && typeof value[key] === 'object') {
        const children = this.renderObjectValues(value[key])
        values.push(
          <div key={'field' + key}>
            <span className="dib b mr1">{key + ':'}</span>
            <div className="pl2">{children}</div>
          </div>
        )
      } else {
        values.push(
          <div key={'field' + key}>
            <span className="dib b mr1">{key + ':'}</span>
            <span className="dib ">{value[key]}</span>
          </div>
        )
      }
    })
    return values
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.id)
    }
  };
}

Card.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  displayValue: PropTypes.any,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isEditing: PropTypes.bool,
}

export default Card
