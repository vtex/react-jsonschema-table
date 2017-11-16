import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import uuid from 'uuid'
import _ from 'underscore'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'
import Icon from '../Common/Icon.react'
import Card from './Card.react'
import { FormattedMessage } from 'react-intl'
import LinksControl from './LinksControl.react'

class Link extends React.Component {
  constructor(props) {
    super(props)
    var multilink = this.props.type === 'array'
    var value = multilink
      ? props.linkedValue
      : props.linkedValue
        ? [props.linkedValue]
        : props.value ? [{ [props.linked_field]: props.value }] : []
    this.state = {
      value: value,
      initInEditingMode: props.isEditing,
      multiLink: multilink,
      searchValue: '',
      idsOfItemsToRender: [],
      showEllipsisCard: false,
      isSingleLine: true,
      relatedEntity: this.props.link.split('/')[5],
      relatedContext: {
        appName: this.props.relatedApp,
        entityId: this.props.link.split('/')[5],
        tableId: this.props.relatedTable,
      },
    }
  }

  componentDidUpdate() {
    if (this.props.isEditing && !this.state.showModal) {
      this.props.onExitEdit()
    }
    if (this.props.userTypedText && !this.props.isEditing) {
      this.handleEditCell()
    }
  }

  componentWillReceiveProps(nextProps) {
    var value = this.state.multiLink
      ? nextProps.linkedValue
      : nextProps.linkedValue
        ? [nextProps.linkedValue]
        : nextProps.value
          ? [{ [nextProps.linked_field]: nextProps.value }]
          : []
    var isEditing = nextProps.isEditing
    if (nextProps.userTypedText && !this.props.userTypedText) {
      this.setState({
        value: value,
        showModal: isEditing,
        userTypedText: nextProps.userTypedText,
      })
    } else {
      this.setState({ value: value, showModal: isEditing })
    }
    if (!this.state.initInEditingMode) {
      this.calculateVisibleLinks()
    }
  }

  render() {
    var rowCardsInList = []
    var control

    const handlers = {
      closeForm: this.handleCloseModal,
      addNew: this.handleAddLink,
    }
    const borderColor = this.props.hasError ? 'b--red' : 'b--blue'

    if (this.state.value) {
      var that = this
      _.each(this.state.value, function(item, index) {
        if (item) {
          var actionIcons = that.props.isFocus
            ? (<div>
              <Icon
                key={`card-link-${index}`}
                className={`pointer mid-gray ml2 fa fa-link dim${item.id ? '' : '  o-30 cursor-not-allowed'}`}
                onClick={item.id ? that.onOpenLink : null}
                id={item.id}
              />
              <Icon
                key={`card-remove-${index}`}
                className={'pointer mid-gray ml2 fa fa-unlink dim'}
                onClick={that.handleRemoveLink}
                id={item.id}
              />

            </div>)
            : null
          var rowCard = (
            <div
              key={`card-show-${index}`}
              className={
                that.props.isFocus
                  ? 'relative pointer flex ph1 mr1 br3 ba b--silver shadow-hover'
                  : 'dit ph1 mr1 br3 ba b--moon-gray'
              }
              ref={`card${index}`}
            >
              <Card
                key={`card-item-show-${index}`}
                displayValue={item[that.props.linked_field]}
                id={item.id}
              />
              {actionIcons}
            </div>
          )
          if (that.props.isFocus) {
            if (that.state.idsOfItemsToRender.indexOf(index) !== -1) {
              rowCardsInList.push(rowCard)
            }
          } else {
            rowCardsInList.push(rowCard)
          }
        }
      })
    }

    const modalLinksDiv = (
      <LinksControl
        ref={div => {
          this.linksControl = div
        }}
        onAddLink={this.handleAddLink}
        onOpenLink={this.handleOpenLink}
        onRemoveLink={this.handleRemoveLink}
        onAssociateLink={this.handleAssociateLink}
        linked_field={this.props.linked_field}
        relatedContext={this.state.relatedContext}
        value={this.state.value}
        userTypedText={this.state.userTypedText}
      />
    )

    if (!this.state.initInEditingMode) {
      var ellipsisIcon = this.state.showEllipsisCard
        ? (<i
          className="pointer mid-gray order-3 top-1 right-2 fa fa-ellipsis-h dim"
          onClick={this.handleEditCell}
        />)
        : null
      var icons = this.props.isFocus
        ? (<div>
          <i
            className="pointer mid-gray mr2 order-1 fa fa-plus dim"
            onClick={this.handleAddLink}
          />
          <i
            className="absolute right-05 top-1 pointer top-50 mid-gray order-last expand-icon fa fa-expand dim"
            onClick={this.handleEditCell}
          />
        </div>)
        : null
      var listLinksDiv
      listLinksDiv = (
        <div
          ref={ref => {
            this.cardsContainer = ref
          }}
          className={`flex items-center  h-inherit${this.props.isFocus ? ` relative bw1 ba ${borderColor} bg-lightest-blue truncate` : this.props.hasError ? 'bw1 ba b--red' : ''}${this.state.isSingleLine ? ' ph2 pv1' : ''}`}
          onDoubleClick={this.handleEditCell}
        >
          {icons}
          {ellipsisIcon}
          {rowCardsInList}
        </div>
      )
      if (this.state.showModal) {
        control = (
          <div className="h-inherit">
            {listLinksDiv}
            <Modal
              ref={ref => {
                this.linkModal = ref
              }}
              show={this.state.showModal}
              onHide={this.handleCloseModal}
            >
              <Modal.Header bsClass={'bb b--moon-gray pa4'} closeButton>
                <Modal.Title>
                  <FormattedMessage id="Link.links.with" />
                  &nbsp;
                  {this.state.relatedEntity}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body bsClass={'relative pa3'}>
                <HotKeys
                  ref={ref => {
                    this.modalLinksBody = ref
                  }}
                  handlers={handlers}
                >
                  {modalLinksDiv}
                </HotKeys>
              </Modal.Body>
            </Modal>
          </div>
        )
      } else {
        control = (
          <HotKeys className="h-inherit" handlers={handlers}>
            {listLinksDiv}
          </HotKeys>
        )
      }

      return control
    }
    return <div className="ba br3 pa3 bw1 b--moon-gray">{modalLinksDiv}</div>
  }

  calculateVisibleLinks = () => {
    var cardsContainer = ReactDOM.findDOMNode(this.cardsContainer)
    var cellWidth = cardsContainer ? cardsContainer.clientWidth : 0
    // o largo disponivel corresponde ao 70% do width da calula, como são duas linhas se multiplica por 1.4
    var availableWidth = cellWidth * 1.4
    // No caso de adicionar um novo item, ele não esta renderizado no DOM
    // a proiedade estimatedRowCardWidth é uma estimativa do width desses fields.
    var estimatedRowCardWidth = 130
    // é definido um fator de correção para estimar o largo, se o controle 'isFocus' a correção é de 10%
    // para contar os pixels usados pelas margens e se não o fator é de 30% para sumar o que vai ser ocupado pelo
    // icone de remover e as margens.
    var widthCorrectionFactor = this.props.isFocus ? 1.1 : 1.3
    var idsOfItemsToRender = []
    var showEllipsisCard = false
    var that = this
    _.each(this.state.value, function(item, index) {
      if (item) {
        var card = ReactDOM.findDOMNode(that.refs[`card-show-${index}`])
        var cardWidth = card && card.clientWidth
          ? card.clientWidth
          : estimatedRowCardWidth
        availableWidth -= cardWidth * widthCorrectionFactor
        if (availableWidth > 0) {
          idsOfItemsToRender.push(index)
        } else {
          showEllipsisCard = true
        }
      }
    })
    // Se o width disponivel for maior que o 30% de uma linha o controle será renderizado em uma linha só
    var isSingleLine = availableWidth > cellWidth * 0.3
    this.setState({
      showEllipsisCard,
      idsOfItemsToRender: idsOfItemsToRender,
      isSingleLine: isSingleLine,
    })
  };

  handleOpenLink = id => {
    this.onOpenLink(id)
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      focusedDiv: null,
      userTypedText: null,
    })
    ReactDOM.findDOMNode(this).focus()
  };

  handleEditCell = () => {
    this.props.onEditCell()
  };

  onOpenLink = id => {
    this.props.onOpenLink(
      id,
      {
        appName: this.props.relatedApp,
        entityId: this.state.relatedEntity,
        tableId: this.props.relatedTable,
      },
      this.onFormClose
    )
  };

  handleAddLink = () => {
    var id = uuid.v4()
    this.props.onAddDocument(
      {
        appName: this.props.relatedApp,
        entityId: this.state.relatedEntity,
        tableId: this.props.relatedTable,
      },
      id
    )
    var newItem = {}
    newItem.id = id
    newItem[this.props.linked_field] = ''

    if (this.state.multiLink) {
      var value = this.props.value ? this.props.value : []
      value.push(newItem)
      this.props.setChange(value)
    } else {
      var changes = {}
      changes[this.props.fieldName] = {
        value: '',
      }
      changes[`${this.props.fieldName}_linked`] = {
        value: newItem,
      }
      this.props.setChanges(this.props.id, changes)
    }
  };

  handleRemoveLink = value => {
    // var newValue = _.filter(this.state.value, function(item) {
    // return item.id !== value.id
    // })
    if (this.state.multiLink) {
      // this.props.setChange(newValue)
    } else {
      var changes = {}
      changes[this.props.fieldName] = {
        value: [],
      }
      changes[`${this.props.fieldName}_linked`] = {
        value: null,
      }
      this.props.setChanges(this.props.id, changes)
    }
  };

  handleAssociateLink = newItem => {
    if (this.state.multiLink) {
      var value = this.props.value ? this.props.value : []
      value.unshift(newItem)
      this.props.setChanges(value)
    } else {
      var changes = {}
      if (typeof newItem === 'object') {
        changes[this.props.fieldName] = {
          value: newItem[this.props.linked_field],
        }
        changes[`${this.props.fieldName}_linked`] = {
          value: newItem,
        }
      } else {
        changes[this.props.fieldName] = {
          value: newItem,
        }
        changes[`${this.props.fieldName}_linked`] = {
          value: null,
        }
      }
      this.props.setChanges(this.props.id, changes)
    }
  };

  onFormClose = () => {
    ReactDOM.findDOMNode(this).focus()
  };
}

Link.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  hasError: PropTypes.bool,
  displayField: PropTypes.string,
  linked_field: PropTypes.string,
  link: PropTypes.string,
  relatedTable: PropTypes.string,
  relatedApp: PropTypes.string,
  setChange: PropTypes.func,
  setChanges: PropTypes.func,
  fieldName: PropTypes.string,
  onAddDocument: PropTypes.func,
  value: PropTypes.any,
  id: PropTypes.string,
  linkedValue: PropTypes.any,
  onOpenLink: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEdit: PropTypes.func,
  isEditing: PropTypes.bool,
  isFocus: PropTypes.bool,
  userTypedText: PropTypes.string,
}

export default Link
