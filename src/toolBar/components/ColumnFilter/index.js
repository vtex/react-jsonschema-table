import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

class ColumnFilter extends React.Component {
  render() {
    if (!this.props.UIschema) {
      return null
    }

    const columns = []

    this.props.UIschema.list.forEach(field => {
      var isChecked = !this.props.hiddenFields.includes(field)
      columns.push(
        <li key={`showColumn${field}`} className="pb3">
          <label htmlFor={`showColumn${field}`} className="pointer">
            <input
              className="pointer mr2"
              type="checkbox"
              id={`showColumn${field}`}
              value={field}
              checked={isChecked}
              onChange={this.handleShowHideColumnClick}
            />
            {` ${field}`}
          </label>
        </li>
      )
    })

    return (
      <div
        className={`absolute mt7 z-999 br3 bg-white pv2 ph5 f6 shadow-1 w-auto ${
          this.props.isSelected ? 'flex flex-column' : 'dn'
        }`}
      >
        <ul className="list pl1 mt3 mb2">{columns}</ul>
        <div
          className="pointer tc ba bw-1 mb3 pa2 br2 bg-blue b--blue white dim w-100"
          onClick={this.handleShowAllColumns}
        >
          <FormattedMessage id="ColumnsToShow.show.all" />
        </div>
      </div>
    )
  }
  handleShowHideColumnClick = ev => {
    this.props.onChangeColumnVisibility(ev.target.value, ev.target.checked)
  }
  handleShowAllColumns = () => {
    this.props.onViewAllColumns()
  }
}

ColumnFilter.propTypes = {
  context: PropTypes.object,
  hiddenFields: PropTypes.array,
  isSelected: PropTypes.bool,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  onChangeColumnVisibility: PropTypes.func,
  onViewAllColumns: PropTypes.func,
}

export default ColumnFilter
