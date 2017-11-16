import '../css/fixedtoolbar.less'
import React from 'react'
import _ from 'underscore'
import Prefix from './Prefix.react'
import Field from './Field.react'
import Operation from './Operation.react'
import Value from './Value.react'
import Actions from '../../../actions/Actions'
import FilterConfiguration from './FilterConfiguration'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.state = this._getStateByProps(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._getStateByProps(nextProps))
  }

  render() {
    var that = this
    var configuration = this.props.configuration

    return (
      <div
        className={'submenu-panel' + (this.props.isSelected ? '' : ' hidden')}
      >
        <ul className="filter-panel">
          {_.map(this.props.filters, function(rowFilter, index) {
            var filterByType = _.deepExtend(
              that._getFilterConfigurationByFieldName(rowFilter.fieldName),
              { fieldName: rowFilter.fieldName }
            )
            var moreConfiguration = _.deepExtend(_.clone(configuration), {
              filterByType,
            })

            return (
              <li key={'row-filter-' + index}>
                <Prefix currentValue={rowFilter.prefix} index={index} />
                <Field index={index} configuration={moreConfiguration} />
                <Operation
                  currentValue={rowFilter.operation}
                  index={index}
                  configuration={moreConfiguration}
                />
                <Value index={index} />
              </li>
            )
          })}
        </ul>
        <div className="submenu-button-panel">
          <div
            className="-button float-left"
            onClick={this.handleAddFilter}
          >
            <FormattedMessage id="Filter.add.filter" />
          </div>

          <div
            className="submenu-button float-right"
            onClick={this.handleRunFilter}
          >
            <FormattedMessage id="Filter.filter" />
          </div>
        </div>
      </div>
    )
  }

  _getStateByProps() {
    // Captura a configuração enviada via 'props'. Nesse caso vai vir a definição do layout e do content-type
    var configuration = this.props.configuration || {}

    // Adiciona a configuração de filtro definida no arquivo FilterConfiguration.js
    configuration.filter = FilterConfiguration

    // Retorna os valores dos filtros que foram recebidos via 'props' e o container de configuração atual da aplicação
    return {
      filters: this.props.filters,
      configuration: configuration,
    }
  }

  _getFilterConfigurationByFieldName(fieldName) {
    // Obtem no content-type a configuração do campo
    var contentTypeField = this.state.configuration.fields[fieldName]
    if (contentTypeField) {
      // Busca nas configurações do filtro a definição para o tipo do campo
      return this.state.configuration.filter.filterableTypes[
        contentTypeField.type
      ]
    }
    return {}
  }

  handleAddFilter() {
    Actions.addFilter()
  }

  handleRunFilter() {
    var configuration = this.state.configuration
    Actions.runFilter(
      configuration.layout.dataEntityName,
      configuration.layout.list,
      this.state.filters
    )
  }
}

Filter.propTypes = {
  configuration: PropTypes.object,
  isSelected: PropTypes.bool,
  filters: PropTypes.object,
}

export default Filter
