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
    birthdate: {
      type: "string",
      format: "date-time",
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
    birthdate: {
      width: 200,
    },
  },
  list: ['email', 'name', 'lastName', 'address', 'birthdate'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: ['name', 'email', 'lastName', 'address', 'birthdate'],
        },
      ],
    },
  },
}

const indexedFields = ['name', 'email']

class App extends Component {
  render() {

    return (
      <div>
        <JsonSchemaTable
          schema={schema}
          stagingItemsCallback={(docs) => {
            console.log('save this staging documents:', docs)
          }}
          items={[
            {
              virtualID: 0,
              document: {
                id: '4c177c9e-499e-11e8-81e8-88f7b34fff36',
                email: 'jhon@doe.com',
                name: 'Jhon',
                lastName: 'Doe',
                address: {},
              },
              status: 'loaded',
            },
            {
              virtualID: 1,
              document: {
                id: '2316cc32-47f2-11e8-81e8-915df33538ea',
                email: 'jane@doe.com',
                name: 'Jane',
                lastName: 'Doe',
                address: {},
              },
              status: 'loaded',
            }
          ]}
          context={{}}
          UIschema={UIschema} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
module.hot.accept()

export default App
