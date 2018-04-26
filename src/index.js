import React from 'react'
import PropTypes from 'prop-types'
import { HotKeys } from 'react-hotkeys'
import keyMap from 'utils/KeyMap'
import 'utils/icons'
import 'vtex-tachyons'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { SetFetcher } from 'actions/FetcherWrapper'
import configureStore from 'redux/configureStore'
import ToolBarContainer from 'toolBar/containers/ToolBarContainer'
import TableContainer from 'table/containers/TableContainer'
import FormContainer from 'table/containers/FormContainer'
import enUSMessages from 'i18n/en-US_messages.json'
import { undo, redo, preLoadItems } from 'actions/items-actions'

const { store } = configureStore()

class JsonSchemaTable extends React.Component {
  constructor(props) {
    super(props)
    SetFetcher(props.fetcher)
    if (props.items && props.items.length > 0) {
      // initial items load
      store.dispatch(preLoadItems(props.items))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.items &&
      this.props.items &&
      prevProps.items.length !== this.props.items.length &&
      this.props.items.length > 0
    ) {
      // more items received by props (not the final solution)
      // To do: fix 'getMoreItems'
      store.dispatch(preLoadItems(this.props.items))
    }
  }

  render() {
    const { schema } = this.props

    if (!schema || Object.keys(schema).length === 0) {
      return <div>jsonschema table cannot render without a jsonschema!</div>
    }

    const lang = 'en' // To do: i18 for realz

    const handleUndo = () => {
      store.dispatch(undo(schema, lang))
    }

    const handleRedo = () => {
      store.dispatch(redo(schema, lang))
    }

    const handlers = {
      undo: handleUndo,
      redo: handleRedo,
    }

    return (
      <Provider store={store}>
        <IntlProvider locale="en-US" messages={enUSMessages}>
          <HotKeys keyMap={keyMap} handlers={handlers} className="outline-0">
            <ToolBarContainer
              context={this.props.context}
              schema={this.props.schema}
              UIschema={this.props.UIschema}
              indexedFields={this.props.indexedFields}
              lang={lang}
              stagingItemsCallback={this.props.stagingItemsCallback}
            />
            <TableContainer
              ref={ref => {
                this.table = ref
              }}
              context={this.props.context}
              UIschema={this.props.UIschema}
              schema={this.props.schema}
              fetchSize={this.props.fetchSize}
              lang={lang}
            />
            <FormContainer
              schema={this.props.schema}
              UIschema={this.props.UIschema}
              onOpenLink={this.handleOpenLink}
              onAddDocument={this.handleAddRowAndOpen}
            />
          </HotKeys>
        </IntlProvider>
      </Provider>
    )
  }
  handleGetNotLoadedDocument = () => {}
}

JsonSchemaTable.propTypes = {
  fetcher: PropTypes.object,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  context: PropTypes.object,
  fetchSize: PropTypes.number,
  lang: PropTypes.string,
  stagingItemsCallback: PropTypes.func,
}

JsonSchemaTable.contextTypes = {
  store: PropTypes.object,
}

export default JsonSchemaTable
