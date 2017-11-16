import React from 'react'
import PropTypes from 'prop-types'

class JSForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const validationErrors = this.state.validationErrors
    return (
      <SectionsControl
        item={this.props.document}
        labels={labels}
        validationErrors={validationErrors}
        configuration={this.props.UISchema}
        schema={this.props.schema}
        {...this.props}
        setChange={this.setChange}
        setChanges={this.setChanges}
      />
    )
  }
}
JSForm.propTypes = {
  document: PropTypes.object,
  UISchema: PropTypes.object,
  Schema: PropTypes.object,
}
export default JSForm
