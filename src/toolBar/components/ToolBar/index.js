import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ColumnFilter from 'toolBar/components/ColumnFilter'
import StateFilters from 'toolBar/components/StateFilters'
import ConfirmAlert from 'components/alert/ConfirmAlert.react.js'
import SaveButton from 'toolBar/components/SaveButton'


class FixedToolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFilterSelected: props.isFilterSelected || false,
      isSortSelected: props.isSortSelected || false,
      isColumnsToShowSelected: props.isColumnsToShowSelected || false,
      isImport: props.isImport || false,
      isCancelEditConfirm: props.isCancelEditConfirm || false,
    }
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
        <div className="">
          <div className="">
            <FormattedMessage id="FixedToolbar.isImport.message" />
          </div>
        </div>
      )
    } else {
      toolBarContent = (
        <div className="flex items-center mb3">
          <div className="flex items-center">
            {/* COLUMN FILTERS BUTTON */}
            <div className="ph3">
              <ColumnFilter
                hiddenFields={this.props.hiddenFields}
                isSelected={isColumnsToShowSelected}
                context={this.props.context}
                UIschema={this.props.UIschema}
                schema={this.props.schema}
                onViewAllColumns={this.props.showAllColumns}
                onChangeColumnVisibility={this.props.changeColumnVisibility}
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
            {/* STATE FILTERS BUTTON */}
            <div className="ph3">
              <StateFilters
                isSelected={this.state.isFilterSelected}
                hasCheckedItems={this.props.hasCheckedItems}
                hasEditedItems={this.props.hasEditedItems}
                hasInvalidItems={this.props.hasInvalidItems}
                isSelectedFilterActive={this.props.isSelectedFilterActive}
                isInvalidFilterActive={this.props.isInvalidFilterActive}
                isStagingFilterActive={this.props.isStagingFilterActive}
                onChangeCheckedItemsFilter={this.props.toggleCheckedItemsFilter}
                onChangeStagingFilter={this.props.toggleStagingFilter}
                onChangeInvalidItemsFilter={this.props.toggleInvalidItemsFilter}
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
          {/* NEW LINE BUTTON */}
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
          {/* DOWNLOAD CHECKED ROWS AS CSV BUTTON */}
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
          {/* DELETE CHECKED ROWS BUTTON */}
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
          {/* UNDO ALL CHANGES BUTTON */}
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
          {/* SAVE ALL BUTTON */}
          <div className="ph3">
            <SaveButton
              handleSaveAll={this.handleSaveAll}
              disabled={!this.props.hasEditedItems}
            />
          </div>
          {this.renderCancelStagingConfirmation()}
        </div>
      )
    }

    return toolBarContent
  }

  clearSelection = () => {
    this.setState({
      isColumnsToShowSelected: false,
      isFilterSelected: false,
      isSortSelected: false,
    })
  }

  handleColumnsToShowClick = () => {
    var currentValue = this.state.isColumnsToShowSelected
    this.clearSelection()
    this.setState({ isColumnsToShowSelected: !currentValue })
  }

  handleFiltersClick = () => {
    var currentValue = this.state.isFilterSelected
    this.clearSelection()
    this.setState({ isFilterSelected: !currentValue })
  }

  handleSortClick = () => {
    var currentValue = this.state.isSortSelected
    this.clearSelection()
    this.setState({ isSortSelected: !currentValue })
  }

  handleSaveAll = () => {
    this.setState({ isSavingMode: true })
    // this.props.onSave()
    this.props.stagingItemsCallback(this.props.items.staging)
  }

  handleExport = () => {
    this.props.onExport()
  }

  handleDeleteCheckedRows = () => {
    this.props.onDeleteCheckedRows(this.props.context)
  }

  handleCancelStaging = () => {
    this.setState({ isCancelEditConfirm: true })
  }

  renderCancelStagingConfirmation = () => {
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

  handleCancelStagingConfirm = () => {
    this.handleCancelStagingCancel()
    this.props.cancelStaging(this.props.context)
    this.props.onCancelStaging(this.props.context)
  }

  handleCancelStagingCancel = () => {
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
  cancelStaging: PropTypes.func,
  onCancelStaging: PropTypes.func,
  toggleCheckedItemsFilter: PropTypes.func,
  toggleStagingFilter: PropTypes.func,
  toggleInvalidItemsFilter: PropTypes.func,
  showAllColumns: PropTypes.func,
  hiddenFields: PropTypes.array,
  changeColumnVisibility: PropTypes.func,
  indexedFields: PropTypes.array,
  stagingItemsCallback: PropTypes.func,
  items: PropTypes.array,
}

export default FixedToolbar
