import React from 'react'
import PropTypes from 'prop-types'
import 'vtex-tachyons'
import Table from './endlessTable/views/Table.react'
import FixedToolbar from './components/fixedtoolbar/FixedToolbar.react'
import HeaderCell from './endlessTable/views/HeaderCell.react'
import Form from './form/Form.react'
import { SetFetcher } from './actions/FetcherWrapper'
import NotificationSystem from 'react-notification-system'
import { connect, Provider } from 'react-redux'
import store from './stores/configureStore'

class JsonSchemaTable extends React.Component {
  constructor(props) {
    super(props)
    SetFetcher(props.fetcher)
    // Call action for initial items load
  }
  render() {
    return (
      <Provider store={store}>
        <FixedToolbar
          context={this.props.context}
          onAdd={this.handleAddRow}
          onDeleteCheckedRows={this.handleDeleteCheckedRows}
          onCancelStaging={this.handleCancelStaging}
          onExport={this.handleExportCheckedItems}
          onSave={this.handleSaveAll}
          {...this.state}
          configuration={this.state.configuration}
        />
        <Table
          ref={ref => {
            this.table = ref
          }}
          context={this.props.context}
          items={this.props.items}
          onGetNotLoadedDocument={this.handleGetNotLoadedDocument}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove}
          onGetItemOptions={this.handleGetItemOptions}
          onCheckRow={this.handleDocumentCheck}
          renderValue={this.renderControlFactory}
          isChecking={false}
        >
          {this.getHeader()}
        </Table>
        <Form
          onOpenLink={this.handleOpenLink}
          setChanges={this.onChangeValue}
          onAddDocument={this.handleAddRowAndOpen}
        />
        <NotificationSystem
          ref={ref => {
            this.msg = ref
          }}
        />
      </Provider>
    )
  }

  getHeader() {
    const that = this
    const header = []
    const schema = this.props.schema
    if (schema) {
      Object.keys(schema.properties).forEach((key, index) => {
        var fieldDef = schema.properties[key]
        var label = (
          <div>
            {/* <i className={`contenTypeIcon fa fa-${fieldDef.icon}`} /> */}
            {fieldDef.title || key}
          </div>
        )
        if (!fieldDef.width) {
          fieldDef.width = 200
        }
        header.push(
          <HeaderCell
            index={index}
            key={key}
            value={label}
            {...fieldDef}
            fieldName={key}
            onHandleSort={that.handleSort}
          />
        )
      })
    }

    return header
  }

  handleGetNotLoadedDocument = () => {}
}

JsonSchemaTable.propTypes = {
  fetcher: PropTypes.object,
  items: PropTypes.array,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  context: PropTypes.object,
  onGetitems: PropTypes.func,
  indexedFields: PropTypes.array,
  onSort: PropTypes.func,
}
const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(JsonSchemaTable)
