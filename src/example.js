import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'

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
    isActive: {
      type: 'boolean',
      title: 'Active',
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
    isActive: {
      width: 300,
    },
  },
  list: ['email', 'name', 'lastName', 'birthdate', 'address', 'isActive'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: ['name', 'email', 'lastName', 'birthdate', 'address', 'isActive'],
        },
      ],
    },
  },
}

class App extends Component {
  render() {
    return (
      <div>
        <JsonSchemaTable
          schema={schema}
          stagingItemsCallback={docs => {
            console.log('save this staging documents:', docs)
          }}
          checkedItemsCallback={docs => {
            console.log('delete this checked documents:', docs)
          }}
          items={[
            {
              virtualID: 0,
              document: {
                id: '4c177c9e-499e-11e8-81e8-88f7b34fff36',
                email: 'jhon@doe.com',
                name: 'Jhon',
                lastName: 'Doe',
                birthdate: '2018-04-20T03:00:00.000Z',
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
                address: {
                  street: 'P. Sherman',
                  number: 42,
                  Postalcode: 'Wallaby Way, Sidney',
                },
                isActive: true,
              },
              status: 'loaded',
            },
          ]}
          context={{}}
          UIschema={UIschema}
        />
      </div>
    )
  }
}

export default hot(module)(App)

ReactDOM.render(<App />, document.getElementById('app'))
