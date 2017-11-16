import React from 'react'
import PropTypes from 'prop-types'

const propertyControl = (WrappedComponent, setChanges) => class
  extends React.Component {
  static propTypes = {
    field: PropTypes.string,
    fieldName: PropTypes.string,
    id: PropTypes.string,
  };
  setPropertychange = (id, propChanges) => {
    const changes = {}
    changes[this.props.field] = {}
    Object.keys(propChanges).map(prop => {
      const propValue = {}
      propValue[prop] = propChanges[prop].value
      changes[this.props.field] = { value: propValue }
    })
    setChanges(this.props.id, changes)
  };

  render() {
    const props = Object.assign({}, this.props)
    props.setChanges = this.setPropertychange
    return <WrappedComponent {...props} />
  }
}

export default propertyControl
