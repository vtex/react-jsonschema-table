import './css/fixedtoolbar.less'
import React from 'react'
import _ from 'underscore'
import Actions from '../../actions/Actions'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

class ColumnsToShow extends React.Component {
  constructor(props) {
    super(props)
    this.handleShowHideColumnClick = this.handleShowHideColumnClick.bind(this)
    this.handleShowAllColumns = this.handleShowAllColumns.bind(this)
  }
  render() {
    var that = this
    if (!this.props.configuration) {
      return <div />
    }
    return (
      <div
        className={'submenu-panel' + (this.props.isSelected ? '' : ' hidden')}
      >
        <div className="submenu-button-panel">
          <div className="submenu-button" onClick={this.handleShowAllColumns}>
            <FormattedMessage id="ColumnsToShow.show.all" />
          </div>
        </div>
        <ul className="list">
          {_.map(this.props.configuration.list, function(field) {
            var isChecked = !_.contains(
              that.props.configuration.hiddenFields,
              field
            )
            return (
              <li key={'showColumn' + field}>
                <label htmlFor={'showColumn' + field}>
                  <input
                    type="checkbox"
                    id={'showColumn' + field}
                    value={field}
                    checked={isChecked}
                    onChange={that.handleShowHideColumnClick}
                  />
                  {that.props.configuration.fields[field].label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  handleShowHideColumnClick(ev) {
    Actions.changeColumnVisibility(
      this.props.context,
      ev.target.value,
      ev.target.checked
    )
  }
  handleShowAllColumns() {
    Actions.showAllColumns(this.props.context)
  }
}

ColumnsToShow.propTypes = {
  context: PropTypes.object,
  configuration: PropTypes.object,
  isSelected: PropTypes.bool,
}

export default ColumnsToShow
