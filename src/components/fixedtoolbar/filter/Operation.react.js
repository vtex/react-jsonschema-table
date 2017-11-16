import '../css/fixedtoolbar.less'
import React from 'react'
import _ from 'underscore'
import PropTypes from 'prop-types'
import Actions from '../../../actions/Actions'

class Operation extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeOperation = this.handleChangeOperation.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    var currentValue = nextProps.currentValue
    var virtualID = nextProps.virtualID
    var configuration = nextProps.configuration

    if (!currentValue && configuration.filterByType.operations) {
      Actions.changeOperationFilter(
        virtualID,
        configuration.filterByType.operations[0]
      )
    }
  }

  render() {
    var operations = []
    var configuration = this.props.configuration

    _.map(configuration.filterByType.operations, function(operation) {
      var operationDefinition = configuration.filter.operations[operation]
      operations.push(
        <option key={operation} value={operation}>
          {operationDefinition.label}
        </option>
      )
    })

    var currentValue = this.props.currentValue
    return (
      <select
        className="operationSelect"
        defaultValue={currentValue}
        onChange={this.handleChangeOperation}
      >
        {operations}
      </select>
    )
  }

  handleChangeOperation() {
    Actions.changeOperationFilter(this, this.props.virtualID)
  }
}

Operation.propTypes = {
  currentValue: PropTypes.any,
  configuration: PropTypes.object,
  virtualID: PropTypes.string,
}

export default Operation
