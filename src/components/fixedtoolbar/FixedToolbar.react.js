import React from 'react'
import ColumnsToShow from './ColumnsToShow.react'
import PropTypes from 'prop-types'
import ConfirmAlert from '../alert/ConfirmAlert.react.js'
import SaveButton from './SaveButton.react'
import { FormattedMessage } from 'react-intl'
import Search from './search/Search.react'

class FixedToolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleCheckFilterClick = this.handleCheckFilterClick.bind(this)
    this.handleStagingFilterClick = this.handleStagingFilterClick.bind(this)
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
    var isColumnsToShowSelected = this.state.isColumnsToShowSelected
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
        <div className="flex justify-between items-center mb3">
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
              <section
                className={`pointer pv2 br3 ph2${
                  isColumnsToShowSelected ? ' bg-light-gray bn relative' : ''
                }`}
                onClick={this.handleColumnsToShowClick}
              >
                <i className="fa fa-columns pr2" />&nbsp;
                <FormattedMessage id="FixedToolbar.ColumnsToShow.columns" />
              </section>
            </div>
            <div className="flex items-center pl5 pr4 v-mid mb2">
              <section
                title={
                  this.props.hasCheckedItems
                    ? 'Exibir somente os registros selecionados'
                    : 'Selecione um ou mais registros para ativar esse fitro'
                }
                className={`ph3 ${
                  !this.props.hasCheckedItems ? 'o-30 cursor-not-allowed' : ''
                }`}
              >
                <div className="ph2 slideTwo">
                  <input
                    type="checkbox"
                    id="checkedRowsSlide1"
                    name="checkedRowsSlide1"
                    onChange={this.handleCheckFilterClick}
                    disabled={!this.props.hasCheckedItems}
                    checked={this.props.isSelectedFilterActive}
                  />
                  <label htmlFor="checkedRowsSlide1">
                    <i className="fa fa-check" />
                  </label>
                </div>
              </section>
              <section
                title="Exibir somente os registros pendentes de sincronização"
                className={`ph3 ${
                  !this.props.hasEditedItems ? 'o-30 cursor-not-allowed' : ''
                }`}
              >
                <div className="ph2 slideTwo">
                  <input
                    type="checkbox"
                    id="checkedRowsSlide2"
                    name="checkedRowsSlide2"
                    onChange={this.handleStagingFilterClick}
                    disabled={!this.props.hasEditedItems}
                    checked={this.props.isStagingFilterActive}
                  />
                  <label htmlFor="checkedRowsSlide2">
                    <i className="fa fa-pencil-alt" />
                  </label>
                </div>
              </section>
              <section
                title="Exibir somente os registros com erros"
                className={`ph3 ${
                  !this.props.hasInvalidItems ? 'o-30 cursor-not-allowed' : ''
                }`}
              >
                <div className="ph2 slideTwo">
                  <input
                    type="checkbox"
                    id="checkedRowsSlide3"
                    name="checkedRowsSlide3"
                    onChange={this.handleOnlyWithErrorFilterClick}
                    checked={this.props.isInvalidFilterActive}
                    disabled={!this.props.hasInvalidItems}
                  />
                  <label htmlFor="checkedRowsSlide3">
                    <i className="fa fa-exclamation" />
                  </label>
                </div>
              </section>
            </div>
          </div>
          <Search />
          <div className="flex" style={{ fontSize: '1.2em' }}>
            <div className="ph3">
              <section
                className={`dib v-mid pointer pv1 ph2 br1 ${
                  !this.props.hasCheckedItems ? 'o-30 cursor-not-allowed' : ''
                }`}
                onClick={!this.props.hasCheckedItems ? null : this.handleExport}
              >
                <i className="fa fa-cloud-download-alt" />
              </section>
              <section
                className={`dib v-mid pointer pv1 ph2 br1' ${
                  !this.props.hasCheckedItems ? 'o-30 cursor-not-allowed' : ''
                }`}
                onClick={
                  !this.props.hasCheckedItems
                    ? null
                    : this.handleDeleteCheckedRows
                }
              >
                <i className="fa fa-trash" aria-hidden="true" />
              </section>
              <section
                className={`dib v-mid pointer pv1 ph2 br1 ${
                  !this.props.hasEditedItems ? 'o-30 cursor-not-allowed' : ''
                }`}
                onClick={
                  !this.props.hasEditedItems ? null : this.handleCancelStaging
                }
              >
                <i className="fa fa-undo" />
              </section>
              <button
                className={
                  'ml3 dib v-mid pointer pa3 br1 bg-white blue bw1 ba b--blue br2'
                }
                onClick={this.props.onAdd}
              >
                <span className="f4">
                  <FormattedMessage id="FixedToolbar.new.line" />
                </span>
              </button>
              <SaveButton
                onClick={this.handleSaveAll}
                disabled={!this.props.hasEditedItems}
              />
            </div>
          </div>
          {this.renderCancelStagingConfirmation()}
        </div>
      )
    }

    return toolBarContent
  }
  handleCheckFilterClick = ev => {
    this.props.onChangeCheckedItemsFilter(ev.target.checked)
  }
  handleStagingFilterClick = ev => {
    this.props.onChangeStagingFilter(ev.target.checked)
  }

  handleOnlyWithErrorFilterClick = ev => {
    this.props.onChangeInvalidItemsFilter(ev.target.checked)
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
