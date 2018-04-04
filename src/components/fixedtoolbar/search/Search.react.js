import React from 'react'
import PropTypes from 'prop-types'
import AutoCompleteFilter from './AutoCompleteFilter.react'
import { HotKeys } from 'react-hotkeys'
import _ from 'underscore'
import onClickOutside from 'react-onclickoutside'

class Search extends React.Component {
  constructor(props, context) {
    super(props, context)
    // const fields = Object.keys(props.fields).map(key => {
    //   props.fields[key].name = key
    //   return props.fields[key]
    // })
    const fields = this.deleteNotIndexedFields(props.fields)
    const logicalOperators = this.getLogicalOperators()
    const stringComparisonOperators = this.getStringComparisonOperator()
    const numberComparisonOperators = this.getNumberComparisonOperator()
    const comparisonOperators = _.union(
      stringComparisonOperators,
      numberComparisonOperators
    )
    let fieldsLabels = []
    fieldsLabels = this.parseFieldsLabels(fields)
    // _.mapObject(props.fields, field => {
    //   if (field.type === 'object') {
    //     _.mapObject(field.properties, (childField, chieldFieldName) => {
    //       fieldsLabels.push(field.label + '.' + chieldFieldName)
    //     })
    //   } else {
    //     fieldsLabels.push(field.label)
    //   }
    // })
    this.state = {
      filters: [
        {
          logicalOp: '',
          field: '',
          comparisonOp: '',
          value: '',
          isNew: true,
          key: new Date().getTime(),
        },
      ],
      fields: fields,
      selectedIndex: null,
      logicalOperatorsLabels: _.pluck(logicalOperators, 'label'),
      // fieldsLabels: _.pluck(props.fields, 'label'),
      fieldsLabels: fieldsLabels,
      stringComparisonOperatorsLabels: _.pluck(
        stringComparisonOperators,
        'label'
      ),
      numberComparisonOperatorsLabels: _.pluck(
        numberComparisonOperators,
        'label'
      ),
      logicalOperators: logicalOperators,
      comparisonOperators: comparisonOperators,
    }

    this.handleAddFilter = this.handleAddFilter.bind(this)
    this.renderFilters = this.renderFilters.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlePopFilter = this.handlePopFilter.bind(this)
    this.handleSelectFilter = this.handleSelectFilter.bind(this)
    this.handleMoveLeft = this.handleMoveLeft.bind(this)
    this.handleMoveRight = this.handleMoveRight.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleEscape = this.handleEscape.bind(this)
  }

  handleClickOutside() {
    this.handleEscape()
  }

  render() {
    const handlers = {
      moveLeft: this.handleMoveLeft,
      moveRight: this.handleMoveRight,
      exitEdit: this.handleEscape,
    }
    return (
      <div className="w-100 w-30-l">
        <HotKeys
          handlers={handlers}
          className={
            this.state.selectedIndex !== null
              ? 'relative flex-row flex-wrap justify-start z-999 bg-white'
              : 'flex-row nowrap overflow-hidden justify-start z-999 bg-white'
          }
          onClick={this.handleClick}
        >
          {this.renderFilters()}
        </HotKeys>
      </div>
    )
  }

  deleteNotIndexedFields = fields => {
    const newFields = { ...fields }
    Object.keys(newFields).map(key => {
      if (!this.props.indexedFields.includes(key)) {
        delete newFields[key]
      }
    })
    console.log('RETURNING NEW FIELDS', newFields)
    return newFields
  }

  parseFieldsLabels = (fields, parentFieldName) => {
    let fieldsLabels = []
    _.mapObject(fields, (field, fieldName) => {
      if (field.type === 'object') {
        const nestedLabels = this.parseFieldsLabels(
          field.properties,
          parentFieldName
            ? `${parentFieldName}.${field.title || field.label || fieldName}`
            : field.title || field.label || fieldName
        )
        fieldsLabels = fieldsLabels.concat(nestedLabels)
      } else {
        fieldsLabels.push(
          parentFieldName
            ? `${parentFieldName}.${field.title || field.label || fieldName}`
            : field.title || field.label || fieldName
        )
      }
    })
    return fieldsLabels
  }

  handleAddFilter(filter, index) {
    const filters = this.state.filters

    if (filters[index].isNew) {
      filters[index] = filter
      filters.push({
        logicalOp: '',
        field: '',
        comparisonOp: '',
        value: '',
        isNew: true,
        key: new Date().getTime(),
      })
    } else {
      filters[index] = filter
    }
    this.setState({ filters: filters, selectedIndex: filters.length - 1 })
    this.updateSearch(filters)
  }

  renderFilters() {
    var listRender = []
    for (var i = 0; i < this.state.filters.length; i++) {
      var filter = this.state.filters[i]
      listRender.push(
        <AutoCompleteFilter
          key={filter.key}
          fields={this.state.fields}
          onCompleteFilter={this.handleAddFilter}
          isFirstFilter={i === 0}
          index={i}
          onDelete={this.handleDelete}
          onMoveLeft={this.handleMoveLeft}
          onMoveRight={this.handleMoveRight}
          filter={filter}
          isSelected={i === this.state.selectedIndex}
          onSelect={this.handleSelectFilter}
          fieldsLabels={this.state.fieldsLabels}
          logicalOperatorsLabels={this.state.logicalOperatorsLabels}
          stringComparisonOperatorsLabels={
            this.state.stringComparisonOperatorsLabels
          }
          numberComparisonOperatorsLabels={
            this.state.numberComparisonOperatorsLabels
          }
        />
      )
    }
    return listRender
  }
  handleClick() {
    if (this.state.selectedIndex === null) {
      this.setState({ selectedIndex: this.state.filters.length - 1 })
    }
  }
  handleMoveLeft() {
    const selectedIndex =
      this.state.selectedIndex > 0
        ? this.state.selectedIndex - 1
        : this.state.selectedIndex
    this.setState({ selectedIndex: selectedIndex })
    console.log(`moveLeft:index:${selectedIndex}`)
  }

  handleMoveRight() {
    const selectedIndex =
      this.state.selectedIndex < this.state.filters.length - 1
        ? this.state.selectedIndex + 1
        : this.state.selectedIndex
    this.setState({ selectedIndex: selectedIndex })
  }

  getLogicalOperators() {
    return [
      {
        name: 'AND',
        label: this.getI18nStr('LogicalOperator.and'),
      },
      {
        name: 'OR',
        label: this.getI18nStr('LogicalOperator.or'),
      },
    ]
  }

  getStringComparisonOperator() {
    return [
      { name: '=', label: '=' },
      { name: '<>', label: '<>' },
      {
        name: 'contains',
        label: this.getI18nStr('ComparisonOperator.contains'),
      },
    ]
  }

  getNumberComparisonOperator() {
    return [
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      {
        name: 'between',
        label: this.getI18nStr('ComparisonOperator.contains'),
      },
    ]
  }

  handleDelete(index) {
    const filters = this.state.filters
    filters.splice(index, 1)
    if (filters[0]) {
      filters[0].logicalOp = ''
    }
    this.setState({ filters: filters })
    this.updateSearch(filters)
  }

  handlePopFilter() {
    const filters = this.state.filters
    filters.plop()
    this.setState({ filters: filters })
  }
  handleEscape() {
    this.setState({ selectedIndex: null })
  }

  handleSelectFilter(index) {
    this.setState({ selectedIndex: index })
  }

  createSearchString(filters) {
    let searchString = '_where=('
    filters.map(filter => {
      if (!filter.isNew) {
        searchString += this.parseFilterToSearchString(filter)
      }
    })
    searchString += ')'
    return searchString
  }

  updateSearch(filters) {
    if (filters.length === 1 && filters[0].isNew) {
      this.props.onSearch('')
    }
    const searchString = this.createSearchString(filters)
    this.props.onSearch(searchString)
  }

  parseFilterToSearchString(filter) {
    const logicalOp = filter.logicalOp
      ? `${
        _.find(
          this.state.logicalOperators,
          op => op.label === filter.logicalOp
        ).name
      } `
      : ''
    const field = this.parseFilterField(filter)
    const comparisonOp = _.find(
      this.state.comparisonOperators,
      op => op.label === filter.comparisonOp
    ).name
    if (comparisonOp === 'contains') {
      return `${logicalOp + field}=*${filter.value}* `
    }
    return `${logicalOp + field + comparisonOp + filter.value} `
  }

  getI18nStr(id) {
    return this.context.intl.formatMessage({ id: id })
  }
  parseFilterField(filter) {
    if (filter.field.includes('.')) {
      const fields = filter.field.split('.')
      let fieldList = this.state.fields
      let fieldString = ''
      for (var i = 0; i < fields.length; i++) {
        const field = _.find(fieldList, (op, key) => {
          return (
            op.title === fields[i] ||
            op.label === fields[i] ||
            key === fields[i]
          )
        })
        fieldString += field.name
        if (i < fields.length - 1) {
          fieldString += '.'
          fieldList = fieldList[field.name].properties
        }
      }
      return fieldString
    }
    return _.find(
      this.props.fields,
      op => op.title === filter.field || op.label === filter.field
    ).name
  }
}
Search.propTypes = {
  fields: PropTypes.object,
  onSearch: PropTypes.func,
  indexedFields: PropTypes.array,
}
Search.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default onClickOutside(Search)
