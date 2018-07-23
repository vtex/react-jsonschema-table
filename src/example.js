import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import faker from 'faker'

import JsonSchemaTable from './index.js'

const schema = {
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    birthdate: {
      type: 'string',
      format: 'date-time',
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
    email: {
      width: 300,
    },
    address: {
      width: 300,
    },
    birthdate: {
      width: 300,
    },
    isActive: {
      width: 300,
    },
  },
  list: ['email', 'name', 'birthdate', 'address', 'isActive'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: [
            'name',
            'email',
            'birthdate',
            'address',
            'isActive',
          ],
        },
      ],
    },
  },
}

const fakeData = new Array(50).fill(true).map((item, index) => {
  return {
    document: {
      email: faker.internet.email().toLowerCase(),
      name: faker.name.findName(),
      birthdate: faker.date.past(),
      isActive: faker.random.boolean(),
      address: {
        street: faker.address.streetName(),
        postalcode: faker.address.zipCode(),
        number: faker.random.number(),
      }
    },
  }
})

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
          items={fakeData}
          context={{}}
          UIschema={UIschema}
        >
          <p>Children prop</p>
        </JsonSchemaTable>
      </div>
    )
  }
}

export default hot(module)(App)

ReactDOM.render(<App />, document.getElementById('app'))
