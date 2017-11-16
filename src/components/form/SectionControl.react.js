import React from 'react'
import ControlFactory from '../dynamic-controls/ControlFactory.react'
import PropTypes from 'prop-types'
import _ from 'underscore'

class SectionControl extends React.Component {
  render() {
    var sectionDef = this.props.section
    var item = this.props.item
    var labels = this.props.labels

    var controls = []
    var that = this
    sectionDef.fields.forEach(function(control) {
      var label = labels[control]
      var value = item ? item[control] : null
      controls.push(<label key={`${control}ui-label-control`}>{label}</label>)
      controls.push(
        <ControlFactory
          key={`${control}ui-control`}
          path={`.${control}`}
          fieldName={control}
          label={label}
          {...that.props.configuration.fields[control]}
          isEditing
          value={value}
          linkedValue={item[`${control}_linked`]}
          onOpenLink={that.handleOpenLink}
          setChanges={that.props.setChanges}
          validationErrors={
            that.props.validationErrors
              ? _.filter(that.props.validationErrors, error => {
                return error.dataPath.includes(`.${control}`)
              })
              : []
          }
          hasError
          renderType={'form'}
          showLabel
          id={item.id}
        />
      )
    })

    return (
      <div className="section">
        <h2>{sectionDef.name}</h2>
        {controls}
      </div>
    )
  }

  handleOpenLink = (id, context) => {
    this.props.onOpenLink(id, context)
  };
}

SectionControl.propTypes = {
  section: PropTypes.object,
  item: PropTypes.object,
  labels: PropTypes.any,
  onOpenLink: PropTypes.func,
  setChanges: PropTypes.func,
}

export default SectionControl
