import React from 'react'
import PropTypes from 'prop-types'
import TextArea from './TextArea.react'
import CheckBox from './CheckBox.react'
import TextBox from './TextBox.react'
import Dropdown from './Dropdown.react'
import Multioptions from './MultiOptions/Multioptions.react'
import ObjectControl from './ObjectControl/ObjectControl.react'
import Attachments from './Attachments/Attachments.react'
import Link from './Link/Link.react'
import DateTime from './DateTime.react'
import ArrayControl from './ArrayControl/ArrayControl.react'
import _ from 'underscore'

class ControlFactory extends React.Component {
  render() {
    if (!this.props.type) {
      throw new Error('O tipo do campo não foi definido')
    }

    const controlConfig = this.getControlConfiguration(this.props)

    const props = {
      ...this.props,
      setChange: this.setChange,
      hasError: this.props.validationErrors.length > 0,
    }

    const errorMessage = this.props.renderType === 'form' && props.hasError
      ? (<span>
        {_.map(this.props.validationErrors, error => {
          return (
            <p className="red br3 mt2 truncate">
              {error.message}
            </p>
          )
        })}
      </span>)
      : null

    return (
      <div
        className={`${this.props.renderType === 'form' ? 'ma3 ' : ''}h-inherit dynamic-control ${controlConfig.style}`}
      >
        {React.createElement(
          controlConfig.control,
          props,
          controlConfig.children
        )}
        {this.props.children}
        {errorMessage}
      </div>
    )
  }

  getControlConfiguration(definition) {
    const configuration = this.getControl(definition)
    const controlName = configuration.control.name
      ? configuration.control.name
      : configuration.control.displayName
    configuration.style = `dynamic-control-${controlName.toLowerCase()}`
    return configuration
  }

  getControl(definition) {
    var configuration = {}
    var type = Array.isArray(definition.type)
      ? definition.type[0]
      : definition.type

    switch (type) {
      case 'boolean':
        configuration.control = CheckBox
        break
      case 'string':
        if (definition.enum) {
          configuration.control = Dropdown
        } else if (definition.format === 'date-time') {
          configuration.control = DateTime
        } else if (definition.multiLine) {
          configuration.control = TextArea
        } else if (definition.link) {
          configuration.control = Link
        } else if (definition.media) {
          configuration.control = Attachments
        } else {
          configuration.control = TextBox
        }

        break
      case 'number':
        configuration.control = TextBox
        break
      case 'integer':
        configuration.control = TextBox
        break
      case 'array':
        if (definition.items.enum) {
          configuration.control = Multioptions
        } else if (
          definition.items.type === 'string' &&
          definition.items.properties &&
          definition.items.properties.link
        ) {
          configuration.control = Link
        } else if (
          definition.items.type === 'string' && definition.items.media
        ) {
          configuration.control = Attachments
        } else {
          configuration.control = ArrayControl
        }
        break
      case 'object':
        configuration.control = ObjectControl
        break
    }
    return configuration
  }

  setChange = newValue => {
    var changes = {}
    changes[this.props.fieldName] = {
      value: newValue,
    }
    this.props.setChanges(this.props.id, changes)
  };

  getI18nStr(id) {
    return this.context.intl.formatMessage({ id: id })
  }
}

ControlFactory.contextTypes = {
  intl: PropTypes.object.isRequired,
}

ControlFactory.propTypes = {
  validationErrors: PropTypes.array,
  isFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  renderType: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  children: PropTypes.node,
  setChanges: PropTypes.func,
  fieldName: PropTypes.string,
  path: PropTypes.string,
  pattern: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRequired: PropTypes.bool,
}

export default ControlFactory
