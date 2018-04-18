import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import Card from './Card.react'
import {
  FormattedMessage,
  injectIntl,
  intlShape,
  defineMessages,
} from 'react-intl'
import { HotKeys } from 'react-hotkeys'
// import Actions from 'actions/Actions'
// import Store from 'stores/VTableStore'

class LinkSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      focusedIndex: -1,
    }

    // Actions.documentLoadPage.completed.listen(this.onSearchResult)
  }

  componentDidUpdate() {
    if (
      this.props.focusedDiv === 'searchControl' &&
      this.state.focusedIndex === -1
    ) {
      this.searchInput.focus()
    }
  }

  componentDidMount() {
    if (this.props.userTypedText) {
      this.setState({ searchValue: this.props.userTypedText })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focusedDiv === 'searchControl' && nextProps.up === true) {
      const index = this.state.searchResultValue &&
        this.state.searchResultValue.length > 0
        ? this.state.searchResultValue.length - 1
        : this.state.searchValue ? 0 : this.state.focusedIndex
      this.setState({ focusedIndex: index })
    }
  }

  render() {
    const that = this
    const searchResults = []
    var searchResultDiv

    const handlers = {
      moveDown: this.onMoveDown,
      moveUp: this.onMoveUp,
      selectItem: this.onEnterSearchResult,
    }

    const messages = defineMessages({
      searchPlaceholder: {
        id: 'Link.search.placeholder',
        defaultMessage: 'Search by keyword'
      }
    })

    if (this.state.searchValue && this.state.searchResultValue) {
      _.each(this.state.searchResultValue, function(item, index) {
        if (item) {
          var associated = _.some(that.props.associtedLinks, function(link) {
            return link.id === item.id
          })
          var rowCard = (
            <Card
              ref={ref => {
                that['searchCard' + index] = ref
              }}
              key={'card-item-show-' + index}
              onClick={associated ? null : that.onAssociateLink}
              displayValue={item}
              id={item.id}
              className={
                associated
                  ? 'relative pl1 bw1 b--silver br3 ma3 h-25 ba bg-light-gray'
                  : that.state.focusedIndex === index
                      ? 'relative pl1 bw1 b--silver br3 ma3 h-25 ba dim pointer shadow-1'
                      : 'relative pl1 bw1 b--silver br3 ma3 h-25 ba dim pointer'
              }
            />
          )
          searchResults.push(rowCard)
        }
      })
      searchResultDiv = (
        <div>
          <div className="bb b--silver mt4 mb4 nr3 nl3" />
          <h4>
            {'Resultados' +
              (this.state.totalRows > this.state.searchResultValue.length
                ? ' (Mostrando 10 de' + this.state.totalRows + ')'
                : '')}
          </h4>
          {searchResults}
        </div>
      )
    }
    return (
      <HotKeys handlers={handlers}>
        <i className="fa fa-search " />
        <input
          ref={ref => {
            this.searchInput = ref
          }}
          type="search"
          className="ml3 w-90 h-100 bn"
          placeholder={
            this.props.intl.formatMessage(messages.searchPlaceholder)
          }
          onKeyUp={this.handleSearchKeyUp}
          value={this.state.searchValue}
          onChange={this.handleSearchValueChange}
        />
        {searchResultDiv}
        {this.state.searchValue.length > 0 ?
          <div>
            <h4 className="tc content-center mid-gray">
              <FormattedMessage id="Link.searchResults.not.found" />
            </h4>
            <button
              className={
                'h-25 br3 bg-blue b--blue white w-100 dim ' +
                  (this.state.focusedIndex === 0 ? 'shadow-1' : '')
              }
              onClick={this.handleAssociateValue}
            >
              <FormattedMessage id="Link.associate.just.value" />
            </button>
          </div> : null
        }
      </HotKeys>
    )
  }

  onMoveUp = () => {
    if (
      this.state.searchValue &&
      this.state.searchResultValue.length === 0 &&
      this.state.focusedIndex === 0
    ) {
      this.setState({ focusedIndex: -1 })
      return
    } else if (this.state.focusedIndex === -1) {
      this.props.onMoveUp()
      return
    }
    var index = this.state.focusedIndex - 1
    this.setState({ focusedIndex: index })
    if (index > -1) {
      var className = this['searchCard' + index].props.className
      if (className === 'row-card-disabled') {
        this.onMoveUp()
      }
    }
  };

  onMoveDown = () => {
    if (this.state.searchValue && this.state.searchResultValue.length === 0) {
      if (this.state.focusedIndex === -1) {
        this.setState({ focusedIndex: 0 })
      } else {
        this.setState({ focusedIndex: -1 })
        this.props.onMoveDown()
      }
    } else if (
      !this.state.searchResultValue ||
      this.state.searchResultValue.length === this.state.focusedIndex + 1
    ) {
      this.setState({ focusedIndex: -1 })
      this.props.onMoveDown()
    } else {
      var index = this.state.focusedIndex + 1
      var className = this['searchCard' + index].props.className
      this.setState({ focusedIndex: index })
      if (className === 'row-card-disabled') {
        this.onMoveDown()
      }
    }
  };

  onEnterSearchResult = () => {
    this.props.onAssociateLink(
      this.state.searchResultValue[this.state.focusedIndex]
    )
  };

  onAssociateLink = id => {
    const item = _.find(this.state.searchResultValue, item => {
      return item.id === id
    })
    this.props.onAssociateLink(item)
  };

  handleAssociateValue = () => {
    this.props.onAssociateLink(this.state.searchValue)
  };

  handleSearchKeyUp = e => {
    var regex = new RegExp('^[a-zA-Z0-9]+$')
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    if (
      regex.test(str) || e.charCode === 32 || e.which === 8 || e.charCode === 8
    ) {
      e.preventDefault()
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(
        function() {
          this.onMakeSearch()
        }.bind(this),
        1000
      )
    }
  };

  onMakeSearch = () => {
    if (!this.state.searchValue) {
      this.setState({ focusedIndex: -1, searchResultValue: null })
      return
    }
    // var relatedModel = this.props.UIschema.models[this.props.context]
    // this.timeout = null
    // // Do the search
    // var filter =
    //   '_keyword=*' + this.state.searchValue + '*'
    // Actions.documentLoadPage(
    //   this.props.context,
    //   relatedModel,
    //   null,
    //   0,
    //   10,
    //   filter
    // )
  };

  onSearchResult = (dataEntityName, docs, rowStart, totalRows) => {
    if (this.state.searchValue) {
      // var allItemsLoaded = totalRows < docs.length
      this.setState({
        searchResultValue: docs,
        expandSearchResultPanel: true,
        totalRows,
        focusedIndex: -1,
      })
    }
  };

  handleSearchValueChange = e => {
    this.setState({ searchValue: e.target.value })
  };
}

LinkSearch.propTypes = {
  intl: intlShape.isRequired,
  linkedField: PropTypes.string,
  context: PropTypes.object,
  onMoveDown: PropTypes.func,
  onMoveUp: PropTypes.func,
  onAssociateLink: PropTypes.func,
  focusedDiv: PropTypes.string,
  up: PropTypes.bool,
  userTypedText: PropTypes.string,
}

export default injectIntl(LinkSearch)
