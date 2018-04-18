import React from 'react'
import Modal from '@vtex/styleguide/lib/Modal'
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

  getLabel = fieldName => {
    const { schema, UIschema } = this.props
    var fieldDefinition = schema.properties[fieldName]
    return (
      <div>
        {/* <i className={`contenTypeIcon fa fa-${fieldDefinition.icon}`} /> */}
        {`${fieldName || 'undefined'}: {${fieldDefinition.type || 'undefined'}}`}
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
        <Modal
          isOpen={showModal}
          // dialogClassName="absolute z-9999 top-2 left-2 w-70 overflow-y-auto bg-white ba b--silver br3 bw1"
          // centered
          onClose={this.handleCloseModal}
          // onExited={this.handleModalExited}
        >
          <div className="w-100">
            <div className="dib w-100">
              <h4 className="pa3">
                {/* {`${this.state.configuration.label}: {${this.state.document.id}}`} */}
                {`${config.title}: {${item.id}}`}
              </h4>
            </div>
            {/* <div className="dib w-30">
              <h4 className="pa3">
                <FormattedMessage id="Form.historic" />
              </h4>
            </div>
            <a className="f2 mid-gray pointer o-90 v-mid" onClick={this.handleCloseModal}>
              <i className="fa fa-times" />
            </a> */}
          </div>
          <div className="pa2">
            <div
              ref={div => {
                if (div) {
                  setTimeout(() => div.scrollTo(0,0), 10)
                }
              }}
              className="dib w-100 pt1 overflow-y-scroll vh-75">
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
            <div className="w-30 h-inherit pt1 overflow-y-scroll flex-column">
              <div className="h-inherit pt1 overflow-y-scroll" />
              {/* <div className="action-panel">
                <img
                  src="http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=33"
                  className="gravatar"
                />
                <input type="text" />
              </div>*/}
            </div>
          </div>
        </Modal>
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
