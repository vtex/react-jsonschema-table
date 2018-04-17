import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import _ from 'underscore'
import AutoCompleteOption from './AutoCompleteOption.react'
import Input from '@vtex/styleguide/lib/Input'

class AutoCompleteFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      autoCompleteOptions: props.logicalOperatorsLabels,
      autCompOptIdx: -1,
      filter: _.clone(props.filter),
      value: '',
      completionState: 'logicalOp',
      showAutoComplete: false,
      isEditing: props.filter.isNew,
      isValid: true,
      isComplete: false,
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.renderAutoCompleteOptions = this.renderAutoCompleteOptions.bind(this)
    this.handleSelectOption = this.handleSelectOption.bind(this)
    this.onMoveDown = this.onMoveDown.bind(this)
    this.onMoveUp = this.onMoveUp.bind(this)
    this.onEnter = this.onEnter.bind(this)
    // this.onEscape = this.onEscape.bind(this)
    this.parseStringFilter = this.parseStringFilter.bind(this)
    this.getCompletionState = this.getCompletionState.bind(this)
    this.getAutoCompleteOptions = this.getAutoCompleteOptions.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.onMoveLeft = this.onMoveLeft.bind(this)
    this.onMoveRight = this.onMoveRight.bind(this)
  }

  componentDidMount() {
    if (this.props.isSelected) {
      // this.addFilter.focus()
    }
  }
  componentDidUpdate() {
    if (
      this.props.isSelected &&
      this.state.isEditing &&
      window &&
      document &&
      document.activeElement !== this.addFilter
    ) {
      // this.addFilter.focus()
    }
    if (this.props.isSelected && !this.state.isEditing && window && document) {
      ReactDom.findDOMNode(this.editFilter).focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.isSelected && !this.props.isSelected) ||
      (nextProps.isFirstFilter && !this.props.isFirstFilter)
    ) {
      const completionState = this.getCompletionState(
        nextProps.filter,
        nextProps
      )
      const autoCompleteOptions = this.getAutoCompleteOptions(
        nextProps.filter,
        completionState,
        nextProps
      )
      const filter = _.clone(nextProps.filter)
      this.setState({
        completionState: completionState,
        autoCompleteOptions: autoCompleteOptions,
        autCompOptIdx: -1,
        filter: filter,
        value: this.filterToString(filter),
      })
    }
    if (
      this.props.isSelected && !nextProps.isSelected && !this.props.filter.isNew
    ) {
      this.setState({
        isEditing: false,
        filter: _.clone(nextProps.filter),
        value: this.filterToString(nextProps.filter),
      })
    }
  }

  render() {
    const handlers = {
      moveDown: this.onMoveDown,
      moveUp: this.onMoveUp,
      selectItem: this.onEnter,
      moveLeft: this.onMoveLeft,
      moveRight: this.onMoveRight,
    }

    const editHandlers = {
      selectItem: this.handleClick,
      delete: this.handleDelete,
    }

    return this.state.isEditing
      ? <HotKeys
        handlers={handlers}
        className="flex-auto"
        onFocus={this.handleFocus}
        onClick={this.handleClick}
        >
        <div className="pv1 pl3 pr6 w-100">
          <i className="fa fa-search mr3 self-center" aria-hidden="true" />
          <Input
            className="w-100"
            label={null}
            error={!this.state.isValid}
            placeholder="Value Filters"
            onChange={this.handleFilterChange}
            value={this.state.value}
            ref={input => {
              this.addFilter = input
            }}
          />
          {/* <input
            type="text"
            className={
                'bn w-100 f4' +
                  (!this.state.isValid ? ' filter-edit-error' : '')
              }
            placeholder="Value Filters"
            ref={input => {
              this.addFilter = input
            }}
            onChange={this.handleFilterChange}
            value={this.state.value}
            /> */}
        </div>
        {this.props.isSelected ? this.renderAutoCompleteOptions() : null}
      </HotKeys>
      : <HotKeys
        handlers={editHandlers}
        className={
            'nowrap flex pv1 ph3 br3 mid-gray ml3 mb3 ' +
              (this.props.isSelected ? 'bg-light-blue b--blue' : 'bg-moon-gray')
          }
        onClick={this.handleClick}
        ref={div => {
          this.editFilter = div
        }}
        >
        <span className="b mr1">{`${this.state.filter.logicalOp} `}</span>
        <span className="mr1">{`${this.state.filter.field} `}</span>
        <span className="b mr1">{`${this.state.filter.comparisonOp} `}</span>
        <span className="mr1">{`${this.state.filter.value} `}</span>
        <div className="ml3 mt1 dib pointer">
          <i
            className="fa fa-times pointer"
            aria-hidden="true"
            onClick={this.handleDelete}
            />
        </div>
      </HotKeys>
  }

  handleFocus() {
    this.setState({ showAutoComplete: true })
  }

  handleClick(e) {
    e.stopPropagation()
    if (!this.state.isEditing) {
      this.setState({ isEditing: true })
    }
    if (!this.props.isSelected) {
      this.props.onSelect(this.props.index)
    }
  }

  handleDelete() {
    this.props.onDelete(this.props.index)
  }

  onMoveDown() {
    var stt = this.state
    if (
      stt.autoCompleteOptions &&
      stt.autCompOptIdx < stt.autoCompleteOptions.length - 1
    ) {
      stt.autCompOptIdx++
    }
    this.setState(stt)
  }

  onMoveUp() {
    var stt = this.state
    if (stt.autCompOptIdx > 0) {
      stt.autCompOptIdx--
    }
    this.setState(stt)
  }

  onMoveLeft(e) {
    if (this.addFilter.selectionStart === 0) {
      e.stopPropagation()
      this.props.onMoveLeft()
    }
  }

  onMoveRight(e) {
    if (this.addFilter.selectionStart === this.addFilter.value.length) {
      e.stopPropagation()
      this.props.onMoveRight()
    }
  }

  onEnter() {
    if (!this.state.isValid) {
      return
    }
    if (this.state.isComplete) {
      const filter = this.state.filter
      filter.isNew = false
      this.props.onCompleteFilter(filter, this.props.index)
      this.setState({
        isEditing: false,
      })
    } else if (this.state.autCompOptIdx !== -1) {
      const selectedValue = this.state.autoCompleteOptions[
        this.state.autCompOptIdx
      ]
      this.handleSelectOption(selectedValue)
    }
  }

  getComparisonOperator() {
    // const filterField = this.state.filter.field
    // let field = null
    // if (filterField.includes('.')) {
    //   const mainField = _.find(
    //     this.props.fields,
    //     field =>
    //       field.title === filterField.split('.')[0] ||
    //       field.label === filterField.split('.')[0]
    //   )
    //   field = mainField.properties[filterField.split('.')[1]]
    // } else {
    //   field = _.find(
    //     this.props.fields,
    //     field => field.title === filterField || field.label === filterField
    //   )
    // }
    const field = this.getFieldFromFieldLabel(this.state.filter.field)

    if (field.type === 'string' && field.format !== 'date-time') {
      return this.props.stringComparisonOperatorsLabels
    }
    return this.props.numberComparisonOperatorsLabels
  }

  getFieldFromFieldLabel = fieldLabel => {
    if (fieldLabel.includes('.')) {
      const fields = fieldLabel.split('.')
      let fieldList = this.props.fields
      for (var i = 0; i < fields.length; i++) {
        const field = _.find(fieldList, (op, key) => {
          return (
            op.title === fields[i] ||
            op.label === fields[i] ||
            key === fields[i]
          )
        })
        if (i < fields.length - 1) {
          fieldList = fieldList[field.name].properties
        } else {
          return field
        }
      }
    }
    return _.find(
      this.props.fields,
      op => op.title === fieldLabel || op.label === fieldLabel
    )
  };

  handleFilterChange(ev) {
    const filter = this.parseStringFilter(ev.target.value)
    const completionState = this.getCompletionState(filter, this.props)
    const autoCompleteOptions = this.getAutoCompleteOptions(
      filter,
      completionState,
      this.props
    )
    let isValid = true

    if (
      completionState !== 'value' &&
      (!autoCompleteOptions || autoCompleteOptions.length === 0) &&
      ev.target.value !== ''
    ) {
      isValid = false
    }
    const isComplete = completionState === 'value' && filter.value !== ''

    this.setState({
      autoCompleteOptions: autoCompleteOptions,
      autCompOptIdx: -1,
      completionState: completionState,
      value: ev.target.value,
      filter: filter,
      isValid: isValid,
      isComplete: isComplete,
    })
  }

  handleSelectOption(value) {
    const filter = this.state.filter
    switch (this.state.completionState) {
      case 'logicalOp':
        filter.logicalOp = value
        break
      case 'field':
        filter.field = value
        break
      case 'comparisonOp':
        filter.comparisonOp = value
        break
      case 'value':
        filter.value = value
        break
    }

    const completionState = this.getCompletionState(filter, this.props)
    const autoCompleteOptions = this.getAutoCompleteOptions(
      filter,
      completionState,
      this.props
    )

    let isValid = true

    if (
      completionState !== 'value' &&
      (!autoCompleteOptions || autoCompleteOptions.length === 0)
    ) {
      isValid = false
    }
    const isComplete = completionState === 'value' && filter.value !== ''

    this.setState({
      autoCompleteOptions: autoCompleteOptions,
      autCompOptIdx: -1,
      completionState: completionState,
      value: this.filterToString(filter),
      filter: filter,
      isValid: isValid,
      isComplete: isComplete,
    })
    // this.addFilter.focus()
  }

  parseStringFilter(value) {
    const filterParts = value.split(':')
    const filter = this.state.filter
    if (this.props.isFirstFilter) {
      filter.logicalOp = ''
      filter.field = filterParts ? filterParts[0] : value
      filter.comparisonOp = filterParts[1] ? filterParts[1] : ''
      filter.value = filterParts[2] ? filterParts[2] : ''
    } else {
      filter.logicalOp = filterParts ? filterParts[0] : value
      filter.field = filterParts[1] ? filterParts[1] : ''
      filter.comparisonOp = filterParts[2] ? filterParts[2] : ''
      filter.value = filterParts[3] ? filterParts[3] : ''
    }
    return filter
  }

  filterToString(filter) {
    let value = filter.logicalOp ? filter.logicalOp + ':' : ''
    value += filter.field ? filter.field + ':' : ''
    value += filter.comparisonOp ? filter.comparisonOp + ':' : ''
    value += filter.value ? filter.value : ''
    return value
  }

  getCompletionState(filter, props) {
    const validLogicalOp =
      props.isFirstFilter ||
      (filter.logicalOp &&
        _.includes(this.props.logicalOperatorsLabels, filter.logicalOp))
    const validField =
      validLogicalOp &&
      filter.field &&
      _.includes(this.props.fieldsLabels, filter.field)
    const validComparisonOp =
      validField &&
      filter.comparisonOp &&
      _.includes(this.getComparisonOperator(), filter.comparisonOp)
    const validValue = validComparisonOp && !!filter.value
    let completionState = 'logicalOp'
    if (validLogicalOp) {
      completionState = 'field'
    }
    if (validField) {
      completionState = 'comparisonOp'
    }
    if (validComparisonOp) {
      completionState = 'value'
    }
    if (validValue) {
      completionState = 'value'
    }
    filter[completionState]
    return completionState
  }

  getAutoCompleteOptions(filter, completionState) {
    let autoCompleteOptions
    switch (completionState) {
      case 'logicalOp':
        autoCompleteOptions = _.filter(
          this.props.logicalOperatorsLabels,
          function(op) {
            return (
              op.toLowerCase().indexOf(filter.logicalOp.toLowerCase()) > -1
            )
          }
        )
        break
      case 'field':
        autoCompleteOptions = _.filter(this.props.fieldsLabels, function(
          field
        ) {
          return field.toLowerCase().indexOf(filter.field.toLowerCase()) > -1
        })
        break
      case 'comparisonOp':
        autoCompleteOptions = _.filter(this.getComparisonOperator(), function(
          op
        ) {
          return (
            op.toLowerCase().indexOf(filter.comparisonOp.toLowerCase()) > -1
          )
        })
        break
    }
    return autoCompleteOptions
  }

  renderAutoCompleteOptions() {
    var listRender = []
    const { autoCompleteOptions, showAutoComplete, autCompOptIdx } = this.state
    if (!autoCompleteOptions || !showAutoComplete) {
      return
    }
    for (var i = 0; i < autoCompleteOptions.length; i++) {
      listRender.push(
        <AutoCompleteOption
          value={autoCompleteOptions[i]}
          onSelect={this.handleSelectOption}
          selected={i === autCompOptIdx}
          key={'option' + i}
        />
      )
    }
    if (listRender.length > 0) {
      return (
        <div className="absolute br2 bg-light-silver z-999 pa1 w-80 left-2">
          {listRender}
        </div>
      )
    }
    return null
  }
}

AutoCompleteFilter.propTypes = {
  onCompleteFilter: PropTypes.func,
  fields: PropTypes.object,
  isFirstFilter: PropTypes.bool,
  onDelete: PropTypes.func,
  onMoveLeft: PropTypes.func,
  onMoveRight: PropTypes.func,
  onEscape: PropTypes.func,
  index: PropTypes.number,
  filter: PropTypes.object,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  logicalOperatorsLabels: PropTypes.array,
  stringComparisonOperatorsLabels: PropTypes.array,
  numberComparisonOperatorsLabels: PropTypes.array,
  fieldsLabels: PropTypes.array,
}

export default AutoCompleteFilter
