import React from 'react'
import PropTypes from 'prop-types'
import 'vtex-tachyons'
import '../src/app.less'
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
import { HotKeys } from 'react-hotkeys'
import keyMap from './KeyMap'

import { SetFetcher } from './actions/FetcherWrapper'
// import NotificationSystem from 'react-notification-system'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './stores/configureStore'
import ToolBar from './containers/ToolBar'
import Table from './containers/Table'
import Form from './containers/Form'
import { IntlProvider } from 'react-intl'
import enUSMessages from './i18n/en-US_messages.json'
import { undo, redo } from './actions/items-actions'
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
  faTimes
)

const { store, persistor } = configureStore()

class JsonSchemaTable extends React.Component {
  constructor(props) {
    super(props)
    SetFetcher(props.fetcher)
    // Call action for initial items load
  }

  render() {
    const { schema } = this.props
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
        <PersistGate loading={null} persistor={persistor}>
          <IntlProvider locale="en-US" messages={enUSMessages}>
            <HotKeys keyMap={keyMap} handlers={handlers}>
              <ToolBar
                context={this.props.context}
                schema={this.props.schema}
                UIschema={this.props.UIschema}
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
        </PersistGate>
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
