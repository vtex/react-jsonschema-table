import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import LinkSearch from './LinkSearch.react'
import { FormattedMessage } from 'react-intl'
import { HotKeys } from 'react-hotkeys'
import Card from './Card.react'
import Icon from '../Common/Icon.react'
import _ from 'underscore'

class LinksControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focusedIndex: -1,
    }
  }

  componentDidUpdate() {
    if (!this.state.focusedDiv) {
      ReactDOM.findDOMNode(this.searchControl).focus()
      this.setState({ focusedDiv: 'searchControl', focusedIndex: -1 })
    }
  }

  render() {
    const allRowCards = []
    _.each(this.props.value, (item, index) => {
      allRowCards.push(
        <Card
          key={`card-item-all-${index}`}
          displayValue={item}
          id={item.id}
          className={
            this.state.focusedDiv === 'associatedCards' &&
              this.state.focusedIndex === index
              ? 'relative pl1 bw1 b--moon-gray br3 ma3 h-25 shadow-1 ba dim'
              : 'relative pl1 bw1 b--moon-gray br3 ma3 h-25 ba dim'
          }
        >
          <Icon
            key={`card-link-${index}`}
            className={`top-1 right-2 absolute white  br-100 f1 mr3 w2 h2 pt1 tc nt3 fa fa-link${item.id ? ' dim bg-black-90 pointer' : '  bg-black-40 o-30 cursor-not-allowed'}`}
            onClick={item.id ? this.handleOpenLink : null}
            id={item.id}
          />
          <Icon
            key={`card-remove-${index}`}
            className={
              'top-1 right-0 absolute white bg-black-90 mr2 ml1 br-100 f1 w2 h2 pt1 tc nt3 dim fa fa-unlink pointer'
            }
            onClick={this.handleRemoveLink}
            id={item.id}
          />
        </Card>
      )
    })
    const associatedDivHandlers = {
      moveDown: this.handleMoveDown,
      moveUp: this.handleMoveUp,
      selectItem: this.handleOpenLink,
      delete: this.handleRemoveLink,
    }

    const addLinkdivHandlers = {
      moveDown: this.handleMoveDown,
      moveUp: this.handleMoveUp,
      selectItem: this.handleAddLink,
    }

    return (
      <div className={'link-modal'}>
        <LinkSearch
          ref={div => {
            this.searchControl = div
          }}
          context={this.props.relatedContext}
          linkedField={this.props.linked_field}
          associtedLinks={this.props.value}
          onMoveDown={this.handleMoveDown}
          onMoveUp={this.handleMoveUp}
          onAssociateLink={this.handleAssociateLink}
          focusedDiv={this.state.focusedDiv}
          up={this.state.up}
          userTypedText={this.props.userTypedText}
        />
        <div className="bb b--moon-gray mt4 mb4 nr3 nl3" />
        <h4>
          <FormattedMessage id="Link.links" />
        </h4>
        <HotKeys
          ref={ref => {
            this.associatedCards = ref
          }}
          handlers={associatedDivHandlers}
          onFocus={this.handleFocusAssociatedDiv}
        >
          {allRowCards}
        </HotKeys>
        <div className="bb b--moon-gray mt4 mb4 nr3 nl3" />
        <HotKeys
          handlers={addLinkdivHandlers}
          onFocus={this.handleFocusAddLinkDiv}
          ref={ref => {
            this.addLink = ref
          }}
        >
          <button
            onClick={this.handleAddLink}
            className={
              this.state.focusedDiv === 'addLink'
                ? 'h-25 br3 bg-blue b--blue white w-100 dim shadow-1'
                : 'h-25 br3 bg-blue b--blue white w-100 dim'
            }
          >
            <i className="fa fa-plus plus-button mr2" />
            <FormattedMessage id="Link.associate.new.entry" />
          </button>
        </HotKeys>
      </div>
    )
  }

  handleFocusAssociatedDiv = () => {
    if (this.state.focusedDiv === 'associatedCards') {
      // se o controle perdeu o foco e esta voltando mas não foi selecionado outro div não mexe no focusedIndex
      return
    } else if (this.state.focusedDiv === 'addLink') {
      this.setState({
        focusedIndex: this.props.value.length - 1,
        focusedDiv: 'associatedCards',
      })
    } else {
      this.setState({ focusedIndex: 0, focusedDiv: 'associatedCards' })
    }
  };

  handleAddLink = () => {
    this.props.onAddLink()
  };

  handleAssociateLink = item => {
    this.props.onAssociateLink(item)
  };

  handleFocusAddLinkDiv = () => {
    this.setState({ focusedDiv: 'addLink', focusedIndex: null })
  };

  handleMoveDown = () => {
    switch (this.state.focusedDiv) {
      case 'addLink':
        ReactDOM.findDOMNode(this.searchControl).focus()
        this.setState({
          focusedIndex: -1,
          focusedDiv: 'searchControl',
          up: false,
        })
        break
      case 'searchControl':
        if (this.props.value.length === this.state.focusedIndex + 1) {
          ReactDOM.findDOMNode(this.addLink).focus()
          this.setState({
            focusedIndex: -1,
            focusedDiv: 'addLink',
          })
        } else {
          ReactDOM.findDOMNode(this.associatedCards).focus()
          this.setState({ focusedIndex: 0, focusedDiv: 'associatedCards' })
        }
        break
      case 'associatedCards':
        if (this.props.value.length === this.state.focusedIndex + 1) {
          ReactDOM.findDOMNode(this.addLink).focus()
          this.setState({
            focusedIndex: -1,
            focusedDiv: 'addLink',
          })
        } else {
          this.setState({ focusedIndex: this.state.focusedIndex + 1 })
        }
    }
  };

  handleMoveUp = () => {
    switch (this.state.focusedDiv) {
      case 'addLink':
        if (this.props.value && this.props.value.length > 0) {
          ReactDOM.findDOMNode(this.associatedCards).focus()
          this.setState({
            focusedIndex: this.props.value.length - 1,
            focusedDiv: 'associatedCards',
          })
        } else {
          ReactDOM.findDOMNode(this.searchControl).focus()
          this.setState({
            focusedIndex: -1,
            focusedDiv: 'searchControl',
            up: true,
          })
        }
        break
      case 'searchControl':
        ReactDOM.findDOMNode(this.addLink).focus()
        this.setState({ focusedIndex: -1, focusedDiv: 'addLink' })
        break
      case 'associatedCards':
        if (this.state.focusedIndex === 0) {
          ReactDOM.findDOMNode(this.searchControl).focus()
          this.setState({
            focusedIndex: -1,
            focusedDiv: 'searchControl',
            up: true,
          })
        } else {
          this.setState({ focusedIndex: this.state.focusedIndex - 1 })
        }
    }
  };

  handleOpenLink = () => {
    var item = this.props.value[this.state.focusedIndex]
    this.props.onOpenLink(item.id)
  };

  handleRemoveLink = () => {
    var item = this.props.value[this.state.focusedIndex]
    this.props.onRemoveLink(item.id)
  };
}

LinksControl.propTypes = {
  children: PropTypes.node,
  onAddLink: PropTypes.func,
  onOpenLink: PropTypes.func,
  onRemoveLink: PropTypes.func,
  onAssociateLink: PropTypes.func,
  linked_field: PropTypes.string,
  relatedContext: PropTypes.object,
  value: PropTypes.array,
  userTypedText: PropTypes.string,
}

export default LinksControl
