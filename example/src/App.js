import React, { Component } from 'react'
import JsonSchemaTable from 'react-jsonschema-table'
const schema = {
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    lastName: {
      type: 'string',
      title: 'LastName',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    isActive: {
      type: 'bool',
      title: 'Is Active',
    },
  },
}

const UIschema = {}

const indexedFields = ['name', 'email']

export default class App extends Component {
  render() {
    const props = {}
    props.items = []
    props.UIschema = UIschema
    props.schema = schema
    props.onGetItems = this.handleLoadDocuments
    props.indexedFields = [indexedFields]
    props.onSort = this.handleSort
    props.context = {}

    return (
      <div>
        <JsonSchemaTable {...props} />
      </div>
    )
  }

  handleLoadDocuments(rowStart) {
    console.log(rowStart)
  }

  handleSort(fieldName, direction) {
    console.log('', fieldName, direction)
  }
}
