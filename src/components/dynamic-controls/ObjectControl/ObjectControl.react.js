import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import ControlFactory from '../ControlFactory.react'
import _ from 'underscore'

class ObjectControl extends React.Component {
  componentDidUpdate() {
    if (this.props.isEditing && this.props.renderType === 'cell') {
      ReactDom.findDOMNode(this).focus()
    }
  }
  render() {
    const className = this.mountClassName()
    const handlers = {
      moveUp: this.onArrow,
      moveDown: this.onArrow,
      moveRight: this.onArrow,
      moveLeft: this.onArrow,
    }
    const control = this.props.isEditing
      ? (<HotKeys
        handlers={handlers}
        className={`relative overflow-y-auto h-max6 ${className}`}
        onClick={this.handleClick}
      >
        <div>
          {this.renderObjectProperties()}
        </div>
      </HotKeys>)
      : (<div className={`flex items-center ${className}`}>
        <div className="truncate">
          {this.props.value
            ? this.renderObjectValues(this.props.value, this.props.properties)
            : ''}
        </div>
      </div>)
    return control
  }
  handleClick = e => {
    e.stopPropagation()
  };

  handleCloseModal = () => {};
  setChange = () => {
    this.props.setChange(this.state.value)
  };

  renderObjectValues = (value, schema) => {
    if (!value) {
      return
    }
    let stringValue = ''
    Object.keys(value).forEach(key => {
      if (schema[key]) {
        if (value[key] && typeof value[key] === 'object') {
          const children = this.renderObjectValues(
            value[key],
            schema[key].properties
          )
          stringValue += `${JSON.stringify(schema[key].title || key)}:${children}, `
        } else {
          stringValue += `${JSON.stringify(schema[key].title || key)}:${JSON.stringify(value[key])}, `
        }
      }
    })
    return stringValue
  };

  renderObjectProperties = () => {
    const itemsToRender = []
    const schemaProps = this.props.properties
    Object.keys(schemaProps).forEach(key => {
      const propertyProps = schemaProps[key]
      const props = { ...this.props, ...propertyProps }
      props.fieldName = key
      // Clean the children of the parent control
      props.children = null
      props.path = `${this.props.path}.${key}`
      props.field = this.props.fieldName
      props.isEditing = true
      props.key = `${this.props.fieldName}.${key}.${this.props.id}`
      props.value = this.props.value ? this.props.value[key] : null
      props.id = this.props.id
      props.validationErrors = this.props.validationErrors
        ? _.filter(this.props.validationErrors, error => {
          return error.dataPath.includes(`${this.props.path}.${key}`)
        })
        : []
      props.setChanges = this.setPropertychange
      props.renderType = 'form'

      itemsToRender.push(
        <label
          key={`${this.props.fieldName}.${key}.${this.props.id}.label`}
          className="dib mid-gray ml1"
        >
          {props.title || key}
        </label>
      )
      itemsToRender.push(<ControlFactory {...props} />)
    })
    return itemsToRender
  };

  setPropertychange = (id, propChanges) => {
    const newValue = { ...this.props.value }
    Object.keys(propChanges).map(prop => {
      newValue[prop] = propChanges[prop].value
    })
    this.props.setChange(newValue)
  };

  mountClassName = () => {
    const borderWidth = this.props.isEditing
      ? this.props.renderType === 'cell' ? 'bw1' : 'bw1'
      : this.props.isFocus ? 'bw1 flex' : 'flex'
    const border = this.props.isEditing
      ? this.props.renderType === 'cell'
        ? `ba ${this.props.hasError ? 'b--red ' : 'b--blue '}`
        : `ba ${this.props.hasError ? 'b--red br3 ' : 'b--moon-gray br3'}`
      : this.props.isFocus
        ? `ba ${this.props.hasError ? 'b--red ' : 'b--blue '} pl05`
        : this.props.hasError ? 'ba b--red pl05' : 'pl2'
    const backGroundColor = this.props.isEditing
      ? 'bg-white'
      : this.props.isFocus ? 'bg-lightest-blue' : ''
    const height = this.props.isEditing ? '' : 'h-inherit'
    const zIndex = this.props.isEditing ? 'z-3' : 'z-2'
    return `w-100 ${height} ${backGroundColor} ${zIndex} ${border} ${borderWidth}`
  };

  onArrow() {}
}

ObjectControl.propTypes = {
  path: PropTypes.string,
  validationErrors: PropTypes.array,
  hasError: PropTypes.bool,
  children: PropTypes.node,
  field: PropTypes.string,
  value: PropTypes.object,
  setChange: PropTypes.func,
  setChanges: PropTypes.func,
  isEditing: PropTypes.bool,
  isSelected: PropTypes.bool,
  isFocus: PropTypes.bool,
  renderType: PropTypes.string,
  properties: PropTypes.object,
  fieldName: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default ObjectControl
