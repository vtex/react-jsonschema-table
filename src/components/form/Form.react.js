import React from 'react'
import { Modal } from 'react-bootstrap'
import _ from 'underscore'
import SectionsControl from './SectionsControl.react'
// import VTableStore from '../stores/VTableStore'
import { HotKeys } from 'react-hotkeys'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: this.props.showModal
    }
  }
  handleCloseModal = () => {
    this.props.hideFormModal()
    // carregar do store o state anterior para mostrar outro dopcumento
    // var storeConf = VTableStore.getPreviousState()
    // if (storeConf) {
    //   var configuration = VTableStore.getAppConfiguration(storeConf.context)
    //   this.setState({
    //     context: storeConf.context,
    //     document: storeConf.document.document,
    //     virtualID: storeConf.document.virtualID,
    //     configuration: configuration,
    //     title: storeConf.title,
    //     showModal: true,
    //   })
    // } else {
      // this.setState({ showModal: false })
      // TODO Não esta sendo chamada essa função no onExited do modal, por enquanto deixar no onHide
      // mas não tem garantia que vai entregar o foco para o item anterior
      if (this.state.callback) {
        this.state.callback()
      }
    // }
  };

  handleModalExited = () => {
    // TODO Não esta sendo chamada essa função no onExited do modal
    if (this.state.callback) {
      this.state.callback()
    }
  };

  componentDidMount() {
    // this.unsubscribe = VTableStore.listen(this.onStoreChange)
  }
  componentWillUnmount() {
    // this.unsubscribe()
  }
  onStoreChange = () => {
    var storeConf = VTableStore.getFormStore()
    if (storeConf.document && storeConf.document.document) {
      var configuration = VTableStore.getAppConfiguration(storeConf.context)
      this.setState({
        context: storeConf.context,
        document: storeConf.document.document,
        validationErrors: storeConf.document.validationErrors,
        configuration: configuration,
        showModal: true,
        title: storeConf.title,
        virtualID: storeConf.document.virtualID,
        callback: storeConf.callback,
      })
    }
  };
  getLabel = fieldName => {
    const { schema, UIschema } = this.props
    var fieldDefinition = schema.properties[fieldName]
    return (
      <div>
        {/* <i className={`contenTypeIcon fa fa-${fieldDefinition.icon}`} /> */}
        {`${fieldDefinition.title || fieldDefinition.label} - (${fieldDefinition.type})`}
      </div>
    )
  };
  setChange = changes => {
    this.props.setChanges(this.state.document.id, changes, this.state.context)
  };
  setChanges = (id, changes) => {
    this.props.setChanges(id, changes, this.state.context)
  };
  render() {
    const { showModal, selectedItem, schema, UIschema } = this.props
    if (!showModal || !selectedItem) {
      return null
    }

    var item = selectedItem.document
    const validationErrors = this.state.validationErrors
    var config = UIschema
    var labels = {}
    config.editor.settings.sections.forEach(section => {
      section.fields.forEach(fieldName => {
        labels[fieldName] = this.getLabel(fieldName)
      })
    })
    const handlers = {
      closeForm: this.closeModal,
    }
    return (
      <HotKeys handlers={handlers}>
        <Modal.Dialog
          show={showModal}
          dialogClassName="z-9999 bg-white tc"
          autoFocus
          onHide={this.handleCloseModal}
          onExited={this.handleModalExited}
        >
          <Modal.Header className="header">
            {/* <div className="edit-header-container">
              <h4 className="edit-header">
                {`${this.state.configuration.label}: {${this.state.document.id}}`}
              </h4>
            </div>
            <div className="history-header-container">
              <h4 className="history-header">
                <FormattedMessage id="Form.historic" />
              </h4>
            </div> */}
            <a className="tl" onClick={this.handleCloseModal}>
              <i className="fa fa-times" />
            </a>
          </Modal.Header>
          <Modal.Body className="form">
            <div className="edit-panel">
              <SectionsControl
                item={item}
                labels={labels}
                validationErrors={validationErrors}
                configuration={config}
                {...this.props}
                setChange={this.setChange}
                setChanges={this.setChanges}
              />
            </div>
            <div className="history-panel">
              <div className="comments-panel" />
              {/* <div className="action-panel">
                <img
                  src="http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=33"
                  className="gravatar"
                />
                <input type="text" />
              </div>*/}
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </HotKeys>
    )
  }
}
Form.propTypes = {
  setChanges: PropTypes.func,
  schema: PropTypes.any,
  UIschema: PropTypes.any,
  selectedItem: PropTypes.any,
  validationErrors: PropTypes.any,
  showModal: PropTypes.bool,
  showFormModal: PropTypes.func,
  hideFormModal: PropTypes.func,
}

export default Form
