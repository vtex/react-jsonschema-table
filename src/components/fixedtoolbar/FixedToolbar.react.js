import React from 'react'
import ColumnsToShow from './ColumnsToShow.react'
import Filters from './Filters.react'
import PropTypes from 'prop-types'
import ConfirmAlert from '../alert/ConfirmAlert.react.js'
import SaveButton from './SaveButton.react'
import { FormattedMessage } from 'react-intl'
import Search from './search/Search.react'

class FixedToolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clearSelection = this.clearSelection.bind(this)
    this.handleColumnsToShowClick = this.handleColumnsToShowClick.bind(this)
    this.handleFiltersClick = this.handleFiltersClick.bind(this)
    this.handleSortClick = this.handleSortClick.bind(this)
    this.handleSaveAll = this.handleSaveAll.bind(this)
    this.handleExport = this.handleExport.bind(this)
    this.handleDeleteCheckedRows = this.handleDeleteCheckedRows.bind(this)
    this.handleCancelStaging = this.handleCancelStaging.bind(this)
    this.renderCancelStagingConfirmation = this.renderCancelStagingConfirmation.bind(
      this
    )
    this.handleCancelStagingConfirm = this.handleCancelStagingConfirm.bind(this)
    this.handleCancelStagingCancel = this.handleCancelStagingCancel.bind(this)
  }

  render() {
    const { isColumnsToShowSelected } = this.state
    const areAnyColumnsHidden = (this.props.hiddenFields.length > 0)
    const areAnyfilterselected = (
      this.props.isSelectedFilterActive ||
      this.props.isInvalidFilterActive ||
      this.props.isStagingFilterActive
    )
    var toolBarContent = null

    if (this.state.isImport) {
      toolBarContent = (
        <div className="fiexdtoolbar-wrapper-import">
          <div className="import-message">
            <FormattedMessage id="FixedToolbar.isImport.message" />
          </div>
        </div>
      )
    } else {
      toolBarContent = (
        <div className="flex items-center mb3">
          <div className="flex items-center">
            <div className="ph3">
              <ColumnsToShow
                hiddenFields={this.props.hiddenFields}
                isSelected={isColumnsToShowSelected}
                context={this.props.context}
                UIschema={this.props.UIschema}
                schema={this.props.schema}
                onViewAllColumns={this.props.onViewAllColumns}
                onChangeColumnVisibility={this.props.onChangeColumnVisibility}
              />
              <div
                className={`pointer ph2 inline-flex nowrap pa2 br2 ${
                  isColumnsToShowSelected ? 'bg-light-gray bn relative' : ''
                } ${
                  areAnyColumnsHidden ? 'blue' : 'black'
                }`}
                onClick={this.handleColumnsToShowClick}
              >
                <i className="fa fa-columns pr2" />
                <div className="dn di-l">
                  <FormattedMessage id="FixedToolbar.ColumnsToShow.columns" />
                </div>
              </div>
            </div>
            <div className="ph3">
              <Filters
                isSelected={this.state.isFilterSelected}
                hasCheckedItems={this.props.hasCheckedItems}
                hasEditedItems={this.props.hasEditedItems}
                hasInvalidItems={this.props.hasInvalidItems}
                isSelectedFilterActive={this.props.isSelectedFilterActive}
                isInvalidFilterActive={this.props.isInvalidFilterActive}
                isStagingFilterActive={this.props.isStagingFilterActive}
                onChangeCheckedItemsFilter={this.props.onChangeCheckedItemsFilter}
                onChangeStagingFilter={this.props.onChangeStagingFilter}
                onChangeInvalidItemsFilter={this.props.onChangeInvalidItemsFilter}
                onHandleFiltersClick={this.handleFiltersClick} />
                <div
                  className={`pointer ph2 inline-flex nowrap pa2 br2 ${
                    this.state.isFilterSelected ? 'bg-light-gray bn relative' : ''
                  } ${areAnyfilterselected ? 'blue' : ''}`}
                  onClick={this.handleFiltersClick}
                >
                  <i className="fa fa-filter pr2" />
                  <div className="dn di-l">
                    <FormattedMessage id="FixedToolbar.StateFilters.filters" />
                  </div>
              </div>
            </div>
          </div>
          <Search />
          <div className="ph3">
            <div
              className={
                'pointer ph2 inline-flex nowrap'
              }
              onClick={this.props.onAdd}
            >
              <i className="fa fa-plus-square pr2" />
              <div className="dn di-l">
                <FormattedMessage id="FixedToolbar.new.line" />
              </div>
            </div>
          </div>
          <div className="ph3">
            <section
              className={`ph2 inline-flex nowrap ${
                !this.props.hasCheckedItems ? 'o-30 cursor-not-allowed' : 'pointer'
              }`}
              onClick={!this.props.hasCheckedItems ? null : this.handleExport}
            >
              <i className="fa fa-cloud-download-alt pr2" />
              <div className="dn di-l">
                <FormattedMessage id="FixedToolbar.download" />
              </div>
            </section>
          </div>
          <div className="ph3">
            <section
              className={`ph2 inline-flex nowrap ${
                !this.props.hasCheckedItems ? 'o-30 cursor-not-allowed' : 'pointer'
              }`}
              onClick={
                !this.props.hasCheckedItems
                  ? null
                  : this.handleDeleteCheckedRows
              }
            >
              <i className="fa fa-trash pr2" aria-hidden="true" />
              <div className="dn di-l">
                <FormattedMessage id="FixedToolbar.deleteChecked" />
              </div>
            </section>
          </div>
          <div className="ph3">
            <section
              className={`ph2 inline-flex nowrap ${
                !this.props.hasEditedItems ? 'o-30 cursor-not-allowed' : 'pointer'
              }`}
              onClick={
                !this.props.hasEditedItems ? null : this.handleCancelStaging
              }
            >
              <i className="fa fa-undo pr2" />
              <div className="dn di-l">
                <FormattedMessage id="FixedToolbar.undo" />
              </div>
            </section>
          </div>
          <div className="ph3">
            <SaveButton
              onClick={this.handleSaveAll}
              disabled={!this.props.hasEditedItems}
            />
          </div>
          {this.renderCancelStagingConfirmation()}
        </div>
      )
    }

    return toolBarContent
  }

  clearSelection() {
    this.setState({
      isColumnsToShowSelected: false,
      isFilterSelected: false,
      isSortSelected: false,
    })
  }
  handleColumnsToShowClick() {
    var currentValue = this.state.isColumnsToShowSelected
    this.clearSelection()
    this.setState({ isColumnsToShowSelected: !currentValue })
  }
  handleFiltersClick() {
    var currentValue = this.state.isFilterSelected
    this.clearSelection()
    this.setState({ isFilterSelected: !currentValue })
  }
  handleSortClick() {
    var currentValue = this.state.isSortSelected
    this.clearSelection()
    this.setState({ isSortSelected: !currentValue })
  }
  handleSaveAll() {
    this.setState({ isSavingMode: true })
    this.props.onSave()
  }
  handleExport() {
    this.props.onExport()
  }
  handleDeleteCheckedRows() {
    this.props.onDeleteCheckedRows(this.props.context)
  }
  handleCancelStaging() {
    this.setState({ isCancelEditConfirm: true })
  }
  renderCancelStagingConfirmation() {
    if (this.state.isCancelEditConfirm) {
      var message = (
        <div>
          <h4>
            <FormattedMessage id="FixedToolbar.renderCancelStagingConfirmation.message.title" />
          </h4>
          <p>
            <FormattedMessage id="FixedToolbar.renderCancelStagingConfirmation.message.subtitle" />
          </p>
        </div>
      )
      return (
        <ConfirmAlert
          show={this.state.isCancelEditConfirm}
          message={message}
          onConfirm={this.handleCancelStagingConfirm}
          onCancel={this.handleCancelStagingCancel}
        />
      )
    }
  }
  handleCancelStagingConfirm() {
    this.handleCancelStagingCancel()
    this.props.onCancelStaging(this.props.context)
  }
  handleCancelStagingCancel() {
    this.setState({ isCancelEditConfirm: false })
  }
}

FixedToolbar.propTypes = {
  context: PropTypes.object,
  hasEditedItems: PropTypes.bool,
  hasInvalidItems: PropTypes.bool,
  hasCheckedItems: PropTypes.bool,
  isStagingFilterActive: PropTypes.bool,
  isInvalidFilterActive: PropTypes.bool,
  isSelectedFilterActive: PropTypes.bool,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  onExport: PropTypes.func,
  onSave: PropTypes.func,
  onAdd: PropTypes.func,
  onDeleteCheckedRows: PropTypes.func,
  onCancelStaging: PropTypes.func,
  onChangeCheckedItemsFilter: PropTypes.func,
  onChangeStagingFilter: PropTypes.func,
  onChangeInvalidItemsFilter: PropTypes.func,
  onViewAllColumns: PropTypes.func,
  hiddenFields: PropTypes.array,
  onChangeColumnVisibility: PropTypes.func,
}

export default FixedToolbar
