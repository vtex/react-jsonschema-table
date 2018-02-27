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
import { HotKeys } from 'react-hotkeys'
import keyMap from './KeyMap'

// import Form from './form/Form.react'
import { SetFetcher } from './actions/FetcherWrapper'
// import NotificationSystem from 'react-notification-system'
import { Provider } from 'react-redux'
import store from './stores/configureStore'
import ToolBar from './containers/ToolBar'
import Table from './containers/Table'
import { IntlProvider } from 'react-intl'
import enUSMessages from './i18n/en-US_messages.json'
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
  faUndo
)

class JsonSchemaTable extends React.Component {
  constructor(props) {
    super(props)
    SetFetcher(props.fetcher)
    // Call action for initial items load
  }
  render() {
    return (
      <Provider store={store}>
        <IntlProvider locale="en-US" messages={enUSMessages}>
          <HotKeys keyMap={keyMap}>
            <ToolBar
              context={this.props.context}
              schema={this.props.schema}
              UIschema={this.props.UIschema}
              lang="en"
            />
            <Table
              ref={ref => {
                this.table = ref
              }}
              context={this.props.context}
              UIschema={this.props.UIschema}
              schema={this.props.schema}
              fetchSize={this.props.fetchSize}
              lang="en"
            />
            {/* <Form
          onOpenLink={this.handleOpenLink}
          setChanges={this.onChangeValue}
          onAddDocument={this.handleAddRowAndOpen}
        /> */}
            {/* <NotificationSystem
          ref={ref => {
            this.msg = ref
          }}
        /> */}
          </HotKeys>
        </IntlProvider>
      </Provider>
    )
  }
  handleGetNotLoadedDocument = () => { }
}

JsonSchemaTable.propTypes = {
  fetcher: PropTypes.object,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  context: PropTypes.object,
  fetchSize: PropTypes.number,
  lang: PropTypes.string,
}

export default JsonSchemaTable
