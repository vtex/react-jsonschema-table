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
    address: {
      type: 'object',
      title: 'Address',
      properties: {
        street: {
          type: 'string',
          title: 'Street',
        },
        postalcode: {
          type: 'string',
          title: 'PostalCode',
        },
        number: {
          type: 'number',
          title: 'Number',
        },
      },
    },
  },
}

const UIschema = {
  title: 'Users',
  fields: {
    name: {
      width: 200,
    },
    lastName: {
      width: 300,
    },
    email: {
      width: 300,
    },
    address: {
      width: 300,
    },
  },
  list: ['email', 'name', 'lastName', 'address'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: ['name', 'email', 'lastName', 'address'],
        },
      ],
    },
  },
}

const indexedFields = ['name', 'email']

class App extends Component {
  render() {
    const props = {
      items: [],
      UIschema,
      schema,
      onGetItems: this.handleLoadDocuments,
      indexedFields,
      onSort: this.handleSort,
      context: {},
    }

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
