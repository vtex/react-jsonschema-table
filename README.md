
# react-jsonschema-table

> Easy to use component for generate an infinite scroll table with inline editing that use JSONSchema to define the structure of data.

[![NPM](https://img.shields.io/npm/v/react-modern-library-boilerplate.svg)](https://www.npmjs.com/package/react-modern-library-boilerplate) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-modern-library-boilerplate
```

## Usage

```js
import React, { Component } from 'react'

import Table from 'react-jsonschema-table'

class Example extends Component {
  render () {
    return (
      <Table />
    )
  }
}
```
## Properties

**schema:** Is the JSONSchema that contains the estructure and validation rules of the rendered data.
**UIschema:** Schema that describe some properties for UI.
indexedFields: An array with the fieldNames that can be used to sort the table.
onSort: function that is called when a sort action is required. Receive the field that trigger the action and the direction to sort.
onGetItems: function used to load the documents on demand.

## Local setup

Setup project

```bash
npm run setup
```

Run example

```bash
npm run start-example
```

Develop

```bash
npm run start-development
```

## License

MIT © [Vtex](https://github.com/transitive-bullshit)
