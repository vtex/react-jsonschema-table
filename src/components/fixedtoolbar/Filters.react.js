import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

class Filters extends Component {
  handleCheckFilterClick = ev => {
    this.props.onChangeCheckedItemsFilter(ev.target.checked)
  }

  handleStagingFilterClick = ev => {
    this.props.onChangeStagingFilter(ev.target.checked)
  }

  handleOnlyWithErrorFilterClick = ev => {
    this.props.onChangeInvalidItemsFilter(ev.target.checked)
  }

  renderFilters = () => {
    return (
      <div>
        <div className="flex flex-inline nowrap dib">
          <section
            title={
              this.props.hasCheckedItems
                ? 'Exibir somente os registros selecionados'
                : 'Selecione um ou mais registros para ativar esse fitro'
            }
            className={`pa2 ${
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
          <div className="self-center">
            <FormattedMessage id="FixedToolbar.StateFilters.checked" />
          </div>
        </div>
        <div className="flex flex-inline nowrap dib">
          <section
            title="Exibir somente os registros pendentes de sincronização"
            className={`pa2 ${
              !this.props.hasEditedItems ? 'o-30 cursor-not-allowed' : ''
            }`}
            onClick={this.handleStagingFilterClick}
          >
            <div className="ph2 slideTwo">
              <input
                type="checkbox"
                id="checkedRowsSlide2"
                name="checkedRowsSlide2"
                onChange={() => {/* TODO: understand y this is not triggered */}}
                disabled={!this.props.hasEditedItems}
                checked={this.props.isStagingFilterActive}
              />
              <label htmlFor="checkedRowsSlide2 nowrap">
                <i className="fa fa-pencil-alt" />
              </label>
            </div>
          </section>
          <div className="self-center">
            <FormattedMessage id="FixedToolbar.StateFilters.edited" />
          </div>
        </div>
        <div className="flex flex-inline nowrap dib">
          <section
            title="Exibir somente os registros com erros"
            className={`pa2 ${
              !this.props.hasInvalidItems ? 'o-30 cursor-not-allowed' : ''
            }`}
            onClick={this.handleOnlyWithErrorFilterClick}
          >
            <div className="ph2 slideTwo">
              <input
                type="checkbox"
                id="checkedRowsSlide3"
                name="checkedRowsSlide3"
                onChange={() => {/* TODO: understand y this is not triggered */}}
                checked={this.props.isInvalidFilterActive}
                disabled={!this.props.hasInvalidItems}
              />
              <label htmlFor="checkedRowsSlide3 nowrap">
                <i className="fa fa-exclamation" />
              </label>
            </div>
          </section>
          <div className="self-center">
            <FormattedMessage id="FixedToolbar.StateFilters.invalid" />
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div
        className={`submenu-panel absolute top-1 mt4 z-999 br3 bg-white pa2 f6 shadow-1 w4 ${
          this.props.isSelected ? 'dib' : 'dn'
        }`}
      >
        <ul className="list pl1 w-100">{this.renderFilters()}</ul>
      </div>
    )
  }
}

Filters.propTypes = {
  isSelected: PropTypes.bool,
  hasCheckedItems: PropTypes.bool,
  hasEditedItems: PropTypes.bool,
  hasInvalidItems: PropTypes.bool,
  isStagingFilterActive: PropTypes.bool,
  isInvalidFilterActive: PropTypes.bool,
  isSelectedFilterActive: PropTypes.bool,
  onChangeCheckedItemsFilter: PropTypes.func,
  onChangeStagingFilter: PropTypes.func,
  onChangeInvalidItemsFilter: PropTypes.func,
}

export default Filters
