import './css/fixedtoolbar.less'
import React from 'react'
import _ from 'underscore'
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
    if (!this.props.UISchema) {
      return <div />
    }
    return (
      <div className={`submenu-panel${this.props.isSelected ? '' : ' hidden'}`}>
        <div className="submenu-button-panel">
          <div className="submenu-button" onClick={this.handleShowAllColumns}>
            <FormattedMessage id="ColumnsToShow.show.all" />
          </div>
        </div>
        <ul className="list">
          {_.map(this.props.UISchema.list, function(field) {
            var isChecked = !_.contains(that.props.hiddenFields, field)
            return (
              <li key={`showColumn${field}`}>
                <label htmlFor={`showColumn${field}`}>
                  <input
                    type="checkbox"
                    id={`showColumn${field}`}
                    value={field}
                    checked={isChecked}
                    onChange={that.handleShowHideColumnClick}
                  />
                  {that.props.UISchema.fields[field].label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  handleShowHideColumnClick(ev) {
    this.props.onChangeColumnVisibility(ev.target.value, ev.target.checked)
  }
  handleShowAllColumns() {
    this.props.onViewAllColumns()
  }
}

ColumnsToShow.propTypes = {
  context: PropTypes.object,
  hiddenFields: PropTypes.array,
  isSelected: PropTypes.bool,
  UISchema: PropTypes.object,
  onChangeColumnVisibility: PropTypes.func,
  onViewAllColumns: PropTypes.func,
}

export default ColumnsToShow
