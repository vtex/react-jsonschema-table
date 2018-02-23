import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import JsonSchemaTable from './index.js'

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
      type: 'boolean',
      title: 'Is Active',
    },
  },
}

const UIschema = {
  fields: {
    id: {
      width: 200,
    },
    name: {
      width: 200,
    },
    lastName: {
      width: 300,
    },
    email: {
      width: 300,
    },
    isActive: {
      width: 300,
    },
  },
  list: ['email', 'name', 'lastName', 'isActive'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: ['name', 'email', 'lastName', 'isActive'],
        },
      ],
    },
  },
}

const indexedFields = ['name', 'email']

class App extends Component {
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
        <JsonSchemaTable className="" {...props} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
module.hot.accept()

export default App
