import React from 'react'
import PropTypes from 'prop-types'
import DropdownList from 'react-widgets/lib/DropdownList'
import { find } from 'underscore'
import Store from 'stores/VTableStore'

class ViewSelector extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    // this.handleToggle = this.handleToggle.bind(this)
    const tables = this.loadTablesFromStore(props.context)
    const selectedTable = find(
      tables,
      table => table.id === props.context.tableId
    )
    this.state = { tables: tables, value: selectedTable }
  }

  componentWillReceiveProps(nextProps) {
    const tables = this.loadTablesFromStore(nextProps.context)
    const selectedTable = find(
      tables,
      table => table.id === nextProps.context.tableId
    )
    this.state = { tables: tables, value: selectedTable }
  }

  render() {
    return (
      <DropdownList
        className="mw5 w-auto fl mr2 dropdown justify-center"
        valueField={'id'}
        textField={'name'}
        // onToggle={this.handleToggle}
        data={this.state.tables}
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(value) {
    this.context.router.history.push(
      `/${this.props.context.appName}/${this.props.context.entityId}/${value.id}`
    )
    this.setState({ value: value })
  }
  // handleToggle() {}
  loadTablesFromStore(entityId) {
    return Store.getEntityTables(entityId)
  }
}

ViewSelector.propTypes = {
  context: PropTypes.object,
}
ViewSelector.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}

export default ViewSelector
