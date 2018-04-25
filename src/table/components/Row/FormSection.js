import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import ControlFactory from 'components/dynamic-controls/ControlFactory.react'

const FormSection = ({
  item,
  labels,
  schema,
  section,
  setChanges,
  validationErrors,
}) => (
  <div className="outline-0">
    <h2>{section.name}</h2>
    {section.fields.map((control, index) => {
      const label = labels[control]
      const value = (item && item[control]) || null

      return (
        <Fragment key={index}>
          <label>{label}</label>
          <ControlFactory
            fieldName={control}
            id={item.id}
            hasError
            isEditing
            label={label}
            linkedValue={item[`${control}_linked`]}
            path={`.${control}`}
            renderType={'form'}
            setChanges={setChanges}
            showLabel
            validationErrors={
              validationErrors
                ? validationErrors.filter(error =>
                  error.dataPath.includes(`.${control}`)
                )
                : []
            }
            value={value}
            {...schema.properties[control]}
          />
        </Fragment>
      )
    })}
  </div>
)

FormSection.propTypes = {
  item: PropTypes.object,
  labels: PropTypes.any,
  onOpenLink: PropTypes.func,
  schema: PropTypes.any,
  section: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setChanges: PropTypes.func,
  UIschema: PropTypes.any,
  validationErrors: PropTypes.array,
}

export default FormSection
