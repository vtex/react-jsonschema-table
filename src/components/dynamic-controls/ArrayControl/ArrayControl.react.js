import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { HotKeys } from 'react-hotkeys'
import ControlFactory from '../ControlFactory.react'
import Icon from '../Common/Icon.react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class ArrayControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showModal: false }
  }
  componentDidUpdate() {
    if (
      this.props.isEditing &&
      !this.state.showModal &&
      this.props.renderType === 'cell'
    ) {
      this.props.onExitEdit()
      ReactDOM.findDOMNode(this).focus()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isEditing && nextProps.renderType === 'cell') {
      this.setState({ showModal: true })
    }
  }

  render() {
    const handlers = {
      moveUp: this.onArrow,
      moveDown: this.onArrow,
      moveRight: this.onArrow,
      moveLeft: this.onArrow,
    }

    const borderColor = this.props.validationErrors &&
      this.props.validationErrors.length > 0
      ? 'b--red'
      : 'b--moon-gray'

    if (this.props.isEditing) {
      if (this.state.showModal) {
        return (
          <div
            className={`h-inherit flex items-center ${this.props.hasError ? 'ba b--red ' : this.props.isFocus ? 'ba b--blue pl05' : ' pl2'}`}
          >
            {this.props.value
              ? `"${this.getI18nStr('Array.items.count')}" : ${this.props.value.length}`
              : null}
            <Modal
              dialogClassName={'vh-75'}
              ref={ref => {
                this.arrayModal = ref
              }}
              show
              onHide={this.handleCloseModal}
            >
              <Modal.Header bsClass={'bb pa4 b--moon-gray'} closeButton>
                <Modal.Title>
                  {this.props.title || this.props.label}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body bsClass={'pa3'}>
                <HotKeys
                  className={'h-auto overflow-y-scroll'}
                  ref={ref => {
                    this.modalLinksBody = ref
                  }}
                  handlers={handlers}
                >
                  {this.renderArrayItems()}
                </HotKeys>
              </Modal.Body>
            </Modal>
          </div>
        )
      }
      return (
        <HotKeys
          className={`ba br3 pa3 bw1 ${borderColor}`}
          handlers={handlers}
        >
          {this.renderArrayItems()}
        </HotKeys>
      )
    }
    return (
      <div
        className={`h-inherit flex items-center ${this.props.hasError ? 'ba b--red ' : this.props.isFocus ? 'ba b--blue pl05' : ' pl2'}`}
      >
        {this.props.value
          ? `"${this.getI18nStr('Array.items.count')}" : ${this.props.value.length}`
          : null}
      </div>
    )
  }

  renderArrayItems() {
    const itemsSchema = this.props.items
    const itemsToRender = []
    _.each(this.props.value, (value, index) => {
      const props = { ...itemsSchema }
      props.value = value
      props.path = `${this.props.path}[${index}]`
      props.fieldName = this.props.fieldName
      props.isEditing = true
      props.key = `${this.props.fieldName}[${index}].${this.props.id}`
      props.id = index
      props.validationErrors = this.props.validationErrors
        ? _.filter(this.props.validationErrors, error => {
          return error.dataPath.includes(`${this.props.path}[${index}]`)
        })
        : []
      props.setChanges = this.setItemchange
      props.renderType = 'form'
      const borderColor = props.validationErrors &&
        props.validationErrors.length > 0
        ? 'b--red'
        : 'b--moon-gray'
      const iconColor = props.validationErrors &&
        props.validationErrors.length > 0
        ? 'bg-red'
        : 'bg-black-90'

      itemsToRender.push(
        <div
          key={`${this.props.fieldName}[${index}].${this.props.id}.container`}
          className={`relative ba mb4 br3 ${borderColor}`}
        >
          <label
            key={`${this.props.fieldName}[${index}].${this.props.id}.label`}
            className="dib mid-gray ml1"
          >
            {props.title}
          </label>
          <ControlFactory {...props} />
          <Icon
            key={`card-remove-${index}`}
            className={`top-1 right-0 z-4 absolute white ${iconColor} mr2 ml1 br-100 f1 w2 h2 pt1 tc nt3 dim fa fa-remove pointer`}
            onClick={this.handleRemoveLink}
            id={index}
          />
        </div>
      )
    })
    itemsToRender.push(
      <button
        onClick={this.handleAddItem}
        key={'add-button'}
        className={'h-25 br3 bg-blue b--blue white w-100 dim'}
      >
        <i className="fa fa-plus plus-button mr2" />
        <FormattedMessage id="Array.add.new.item" />
      </button>
    )
    return itemsToRender
  }
  setItemchange = (id, itemChanges) => {
    const newValue = this.props.value ? this.props.value.slice() : []
    newValue[id] = itemChanges[this.props.fieldName].value
    this.props.setChange(newValue)
  };
  onArrow() {}

  handleAddItem = () => {
    const newValue = this.props.value ? this.props.value.slice() : []
    const newItem = this.props.items.type === 'object'
      ? {}
      : this.props.items.type === 'array' ? [] : null
    newValue.push(newItem)
    this.props.setChange(newValue)
  };

  handleCloseModal = () => {
    this.setState({ showModal: false })
    ReactDOM.findDOMNode(this).focus()
  };

  handleRemoveLink = index => {
    const newValue = this.props.value ? this.props.value.slice() : []
    newValue.splice(index, 1)
    this.props.setChange(newValue)
  };

  getI18nStr(id) {
    return this.context.intl.formatMessage({ id: id })
  }
}
ArrayControl.contextTypes = {
  intl: PropTypes.object.isRequired,
}

ArrayControl.propTypes = {
  items: PropTypes.object,
  value: PropTypes.array,
  path: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  validationErrors: PropTypes.array,
  hasError: PropTypes.bool,
  children: PropTypes.node,
  field: PropTypes.string,
  setChange: PropTypes.func,
  setChanges: PropTypes.func,
  isEditing: PropTypes.bool,
  isSelected: PropTypes.bool,
  isFocus: PropTypes.bool,
  renderType: PropTypes.string,
  properties: PropTypes.object,
  fieldName: PropTypes.string,
  id: PropTypes.string,
  onExitEdit: PropTypes.func,
}
export default ArrayControl