import React from 'react'
import PropTypes from 'prop-types'
import SectionControl from './SectionControl.react'

const SectionsControl = function(props) {
  var configuration = props.configuration
  var item = props.item
  var labels = props.labels
  var sections = []
  var count = 1
  props.UIschema.editor.settings.sections.forEach(function(section) {
    sections.push(
      <SectionControl
        key={section + '-formsection-' + count++}
        section={section}
        labels={labels}
        item={item}
        configuration={configuration}
        {...props}
      />
    )
  })

  return (
    <div>
      {sections}
    </div>
  )
}

SectionsControl.propTypes = {
  schema: PropTypes.any,
  UIschema: PropTypes.any,
  configuration: PropTypes.object,
  item: PropTypes.object,
  labels: PropTypes.object,
}

export default SectionsControl
