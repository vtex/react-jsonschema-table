import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
// import Toggle from 'react-toggle'

class ColumnsToShow extends React.Component {
  render() {
    if (!this.props.UIschema) {
      return null
    }

    const columns = []

    this.props.UIschema.list.forEach(field => {
      var isChecked = !this.props.hiddenFields.includes(field)
      columns.push(
        <li key={`showColumn${field}`}>
          <label htmlFor={`showColumn${field}`} className="pointer">
            <input
              className="pointer mr2"
              type="checkbox"
              id={`showColumn${field}`}
              value={field}
              checked={isChecked}
              onChange={this.handleShowHideColumnClick}
            />
            {this.props.schema.properties[field].title}
          </label>
        </li>
      )
    })

    return (
      <div
        className={`submenu-panel absolute mt4 z-999 br3 bg-white pa2 f6 shadow-1 ${
          this.props.isSelected ? 'dib' : 'dn'
        }`}
      >
        <ul className="list pl1">{columns}</ul>
        <div className="db w-100 mv2">
          <div
            className="pointer di ba bw-1 pa2 br3 bg-blue b--blue white dim"
            onClick={this.handleShowAllColumns}
          >
            <FormattedMessage id="ColumnsToShow.show.all" />
          </div>
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

ColumnsToShow.propTypes = {
  context: PropTypes.object,
  hiddenFields: PropTypes.array,
  isSelected: PropTypes.bool,
  UIschema: PropTypes.object,
  schema: PropTypes.object,
  onChangeColumnVisibility: PropTypes.func,
  onViewAllColumns: PropTypes.func,
}

export default ColumnsToShow
