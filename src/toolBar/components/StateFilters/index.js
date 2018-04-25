import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import Toggle from '@vtex/styleguide/lib/Toggle'

class StateFilters extends Component {
  handleCheckFilterClick = ev => {
    this.props.onChangeCheckedItemsFilter(ev.target.checked)
  }

  handleStagingFilterClick = ev => {
    this.props.onChangeStagingFilter(ev.target.checked)
  }

  handleOnlyWithErrorFilterClick = ev => {
    this.props.onChangeInvalidItemsFilter(ev.target.checked)
  }

  render() {
    const {
      intl,
      isSelected,
      isSelectedFilterActive,
      hasCheckedItems,
      isStagingFilterActive,
      hasEditedItems,
      isInvalidFilterActive,
      hasInvalidItems,
    } = this.props
    return (
      <div
        className={`absolute top-1 mt7 z-999 br3 bg-white pa2 f6 shadow-1 w-auto ${
          isSelected ? 'dib' : 'dn'
        }`}
      >
        <div>
          <div className="dib pa4">
            <Toggle
              label={intl.formatMessage({ id: 'FixedToolbar.StateFilters.checked' })}
              disabled={!hasCheckedItems}
              checked={isSelectedFilterActive}
              onClick={this.handleCheckFilterClick} />
          </div>
          <br />
          <div className="dib pa4">
            <Toggle
              label={intl.formatMessage({ id: 'FixedToolbar.StateFilters.edited' })}
              disabled={!hasEditedItems}
              checked={isStagingFilterActive}
              onClick={this.handleStagingFilterClick} />
          </div>
          <br />
          <div className="dib pa4">
            <Toggle
              label={intl.formatMessage({ id: 'FixedToolbar.StateFilters.invalid' })}
              disabled={!hasInvalidItems}
              checked={isInvalidFilterActive}
              onClick={this.handleOnlyWithErrorFilterClick} />
          </div>
        </div>
      </div>
    )
  }
}

StateFilters.propTypes = {
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
  intl: intlShape.isRequired,
}

export default injectIntl(StateFilters)
