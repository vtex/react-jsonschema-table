import React from 'react'
import PropTypes from 'prop-types'
import 'vtex-tachyons'
import fontawesome from '@fortawesome/fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faExclamation from '@fortawesome/fontawesome-free-solid/faExclamation'
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import facolumns from '@fortawesome/fontawesome-free-solid/faColumns'
import faDownload from '@fortawesome/fontawesome-free-solid/faCloudDownloadAlt'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faCheckSquare from '@fortawesome/fontawesome-free-solid/faCheckSquare'
import faSquare from '@fortawesome/fontawesome-free-solid/faSquare'
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter'
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlusSquare'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faExpand from '@fortawesome/fontawesome-free-solid/faExpand'
import { HotKeys } from 'react-hotkeys'
import keyMap from './KeyMap'

import { SetFetcher } from './actions/FetcherWrapper'
import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
import configureStore from 'redux/configureStore'
import ToolBarContainer from 'toolBar/containers/ToolBarContainer'
import Table from './containers/Table'
import Form from './containers/Form'
import { IntlProvider } from 'react-intl'
import enUSMessages from './i18n/en-US_messages.json'
import {
  undo,
  redo,
  preLoadItems,
} from './actions/items-actions'
// import ptBRMessages from '!json-loader!./js/i18n/pt-BR_messages.json'
// import esARMessages from '!json-loader!./js/i18n/es-AR_messages.json'

// addLocaleData([...en, ...es, ...pt])

fontawesome.library.add(
  facolumns,
  faCheck,
  faPencil,
  faExclamation,
  faTrash,
  faDownload,
  faUndo,
  faSearch,
  faSquare,
  faCheckSquare,
  faFilter,
  faPlusSquare,
  faSave,
  faTimes,
  faPlus,
  faExpand,
)

const { store, persistor } = configureStore()

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
        prevProps.items && this.props.items &&
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
    const lang = 'en'

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
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <IntlProvider locale="en-US" messages={enUSMessages}>
            <HotKeys keyMap={keyMap} handlers={handlers} className="outline-0">
              <ToolBarContainer
                context={this.props.context}
                schema={this.props.schema}
                UIschema={this.props.UIschema}
                indexedFields={this.props.indexedFields}
                lang={lang}
              />
              <Table
                ref={ref => {
                  this.table = ref
                }}
                context={this.props.context}
                UIschema={this.props.UIschema}
                schema={this.props.schema}
                fetchSize={this.props.fetchSize}
                lang={lang}
              />
              <Form
                schema={this.props.schema}
                UIschema={this.props.UIschema}
                onOpenLink={this.handleOpenLink}
                onAddDocument={this.handleAddRowAndOpen}
              />
              {/* <NotificationSystem

            ref={ref => {
              this.msg = ref
            }}
          /> */}
            </HotKeys>
          </IntlProvider>
        {/* </PersistGate> */}
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
}

JsonSchemaTable.contextTypes = {
  store: PropTypes.object,
}

export default JsonSchemaTable
