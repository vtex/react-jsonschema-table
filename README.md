
# react-jsonschema-table

> Simple usage react component stylesheet table with inifnite scroll for massive data consumption and line editing using JSONSchema as data structure.

### Work In Progress !

[![NPM](https://img.shields.io/npm/v/react-modern-library-boilerplate.svg)](https://www.npmjs.com/package/react-modern-library-boilerplate) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-jsonschema-table
```

## Simple Usage

```js
import React, { Component } from 'react'

import { SpreadSheetTable } from 'react-jsonschema-table'

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
    }
  }
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
    }
  },
  list: ['email', 'firstName', 'lastName'],
  editor: {
    settings: {
      sections: [
        {
          name: 'Personal Data',
          fields: [
            'firstName',
            'email',
            'lastName',
          ],
        },
      ],
    },
  },
}

const items = [{
  virtualId: 0,
  document: {
    name: 'Jhon',
    lastName: 'Doe',
    email: 'jhon@doe.com',
  }
}]

class Example extends Component {
  render () {
    return (
      <SpreadSheetTable schema={schema} UIschema={UIschema} items={items} />
    )
  }
}
```
## API

**schema:** Is the JSONSchema that contains the estructure and validation rules of the rendered data.

**UIschema:** Is the JSONSchema that contains necessary data for UI purposes, such as labels, width and editor sections for complete row editing.

**items**: An array of document objectcs compliant to the schema format. exemple:
```js
  items: [{
    virtualId: 0, // integer
    document: { // actual document
      name: 'Jhon',
      lastName: 'Doe',
      email: 'jhon@doe.com',
      id: '2a08db19-894c-4d1a-82b6-f4abe2ebbe33'
    }, // compliant to schema, you can have extra fields, they will not show on the Table but will be considered in callbacks
    status: 'loaded' // string (one of 'loaded', 'loading', 'lazzy','new','invalid')
  }]
```

**pagination**: boolean default true. If JsonschemaTable should paginate items for better handling massive amounts of items. (callback will be called when user has scrolled until 80% of items)

**getMoreItems**: function callback so JsonschemaTable can let you know it needs to load more items if pagination is activated

**shouldSaveData**: boolean default true that activates the save feature. (which can be configured with the following function)

**stagingItemsCallback**: function that return all the staging documents when 'save' button is clicked, so you can save them to your API or whatever.

**checkedItemsCallback**: function that return all the checked documents when 'delete' button is clicked, so you can delete them in your API or whatever.

**toolbarConfigs**: object to configure and toggle toolbar functions. example:
```js
toolbarConfigs: {
  hideStateFilterBtn: true,
  hideColumnsVisibilityBtn: true,
  hideDownloadBtn: true,
  hideNewLineBtn: true,
  hideDeleteBtn: true,
  hideUndoBtn: true,
  hideSaveBtn: true,
}
```

## Local setup for developing

Setup project

```bash
npm i
```

Run example

```bash
npm start
```

## License

MIT © [VTEX](https://github.com/vtex)
