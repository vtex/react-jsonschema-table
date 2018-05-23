import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import faker from 'faker'
import Toggle from '@vtex/styleguide/lib/Toggle'

import {
  SpreadsheetTable,
  ReadOnlyTable,
} from './index.js'

const schema = {
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    birthdate: {
      type: 'string',
      format: 'date-time',
      title: 'Birth date'
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
    firstName: {
      width: 300,
    },
    lastName: {
      width: 300,
    },
    email: {
      width: 300,
    },
    birthdate: {
      width: 300,
    },
    address: {
      width: 300,
    },
    isActive: {
      width: 300,
    },
  },
  list: ['email', 'firstName', 'lastName', 'birthdate', 'address', 'isActive'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: [
            'firstName',
            'email',
            'lastName',
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
    virtualID: index,
    document: {
      index,
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthdate: faker.date.past(),
      address: {
        street: faker.address.streetName(),
        postalcode: faker.address.zipCode(),
        number: faker.random.number(),
      },
      isActive: faker.random.boolean()
    },
    status: 'loaded',
  }
})

class App extends Component {
  constructor(){
    super()
    this.state = {
      readOnly: false
    }
  }

  renderSpreadSheetComponent = () => {
    return (
      <div>
        <SpreadsheetTable
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
          <input
            type="text"
            className="ml4 mv3 pa3 h2 ba br2 b--light-gray w-70"
            placeholder="Children can be passed to be rendered here..."
          />
        </SpreadsheetTable>
      </div>
    )
  }

  renderReadOnlyComponent = () => {
    return (
      <div className="mh6 relative vh-75">
        <ReadOnlyTable
          schema={schema}
          items={fakeData}
          UIschema={UIschema}
        />
      </div>
    )
  }

  toggleReadOnly = () => {
    const { readOnly } = this.state
    this.setState({ readOnly: !readOnly })
  }

  render() {
    const { readOnly } = this.state
    return (
      <div>
        <div
          className="flex flex-row justify-between w-100 bg-near-white pl7 pt8 pb5 b f2 mb7"
        >
          React JsonschemaTable Examples
          <div className="mr6 flex items-center">
            <span className="mr6 f4">
              Read Only Mode
            </span>
            <div style={{ transform: 'scale(0.6)' }}>
              <Toggle checked={readOnly} onChange={this.toggleReadOnly} />
            </div>
          </div>
        </div>
        {
          readOnly
            ? this.renderReadOnlyComponent()
            : this.renderSpreadSheetComponent()
        }
      </div>
    )
  }
}

export default hot(module)(App)

ReactDOM.render(<App />, document.getElementById('app'))
