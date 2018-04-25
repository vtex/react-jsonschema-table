import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import Modal from '@vtex/styleguide/lib/Modal'

import FormSection from './FormSection'

class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: props.showModal,
    }
  }

  handleCloseModal = () => {
    this.props.hideFormModal()

    if (this.state.callback) {
      this.state.callback()
    }
  }

  handleModalExited = () => {
    // TODO Não esta sendo chamada essa função no onExited do modal
    if (this.state.callback) {
      this.state.callback()
    }
  }

  getLabel = fieldName => {
    const fieldDefinition = this.props.schema.properties[fieldName]

    return <div>{`${fieldName} (${fieldDefinition.type}):`}</div>
  }

  setChange = change => {
    const {
      context,
      document: { id },
    } = this.state

    this.props.setChanges(id, change, context)
  }

  setChanges = (id, changes) => {
    this.props.setChanges(id, changes, this.state.context)
  }

  render() {
    const { schema, showModal, selectedItem, UIschema } = this.props
    const { validationErrors } = this.state

    if (!showModal || !selectedItem) {
      return null
    }

    const handlers = {
      closeForm: this.closeModal,
    }

    const item = selectedItem.document

    const sections = UIschema.editor.settings.sections

    const labels = sections.reduce((labelAcc, currSection) => {
      const currSectionLabels = currSection.fields.reduce(
        (sectionAcc, currField) => ({
          ...sectionAcc,
          [currField]: this.getLabel(currField),
        }),
        {}
      )

      return { ...labelAcc, ...currSectionLabels }
    }, {})

    return (
      <HotKeys handlers={handlers}>
        <Modal isOpen={showModal} onClose={this.handleCloseModal}>
          <div className="w-100">
            <div className="dib w-100">
              <h4 className="pa3">{`${UIschema.title}: {${item.id}}`}</h4>
            </div>
          </div>
          <div className="pa2">
            <div
              ref={div => {
                if (div) {
                  setTimeout(() => div.scrollTo(0, 0), 10)
                }
              }}
              className="dib w-100 pt1 overflow-y-scroll vh-75"
            >
              {sections.map((section, index) => (
                <FormSection
                  key={index}
                  configuration={UIschema}
                  labels={labels}
                  item={item}
                  schema={schema}
                  section={section}
                  setChange={this.setChange}
                  setChanges={this.setChanges}
                  UIschema={UIschema}
                  validationErrors={validationErrors}
                />
              ))}
            </div>
          </div>
        </Modal>
      </HotKeys>
    )
  }
}

Form.propTypes = {
  hideFormModal: PropTypes.func,
  schema: PropTypes.any,
  selectedItem: PropTypes.any,
  setChanges: PropTypes.func,
  showFormModal: PropTypes.func,
  showModal: PropTypes.bool,
  UIschema: PropTypes.any,
  validationErrors: PropTypes.any,
}

export default Form
