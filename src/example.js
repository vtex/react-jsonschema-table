import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import JsonSchemaTable from './index.js'

const schema = {
  properties: {
    id: {
      type: 'string',
      title: 'Id',
    },
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
      }
    },
    isActive: {
      type: 'boolean',
      title: 'Is Active',
    },
  },
}

const UIschema = {
  title: 'Users',
  fields: {
    id: {
      width: 100,
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
  list: ['id','email', 'name', 'lastName', 'address', 'isActive'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: ['id', 'name', 'email', 'lastName', 'address', 'isActive'],
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
      indexedFields: [ indexedFields ],
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
