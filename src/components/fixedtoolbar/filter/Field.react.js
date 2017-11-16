import '../css/fixedtoolbar.less'
import React from 'react'
import _ from 'underscore'
import Actions from '../../../actions/Actions'
import PropTypes from 'prop-types'

class Field extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeField = this.handleChangeField.bind(this)
  }
  render() {
    var filterableFields = []
    var configuration = this.props.configuration

    _.map(configuration.fields, function(props, fieldName) {
      // Busca a definição do campo no Content-Type
      var fieldDefinition = configuration.fields[fieldName]

      // Busca a definição de filtro pelo Type do campo no Content-Type
      var filterTypeDefinition =
        configuration.filter.filterableTypes[fieldDefinition.type]

      // Se houver alguma definição, é porque o campo pode ser usado como filtro, nesse caso adiciona ele na lista 'filterableFields'
      if (filterTypeDefinition) {
        var label = configuration.fields[fieldName].label // Localiza o Label do campo para exibir na Dropdown
        filterableFields.push(
          <option key={'filter-field-' + fieldName} value={fieldName}>
            {label}
          </option>
        )
      }
    })

    var currentValue = this.props.configuration.filterByType.fieldName
    return (
      <select
        className="fieldSelect"
        defaultValue={currentValue}
        onChange={this.handleChangeField}
      >
        <option />
        {filterableFields}
      </select>
    )
  }
  handleChangeField() {
    Actions.changeFieldFilter(this, this.props.virtualID)
  }
}

Field.propTypes = {
  configuration: PropTypes.object,
  virtualID: PropTypes.string,
}

export default Field
