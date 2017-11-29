import * as types from '../actions/ActionTypes'
import Status from '../constants/Status'
import Ajv from 'ajv'
import ajvLocalize from 'ajv-i18n'
const ajv = new Ajv({ allErrors: true })

const initialState = {
  source: [],
  staging: {},
  historyChanges: [],
  historyIndex: 0,
  where: null,
  sort: null,
  isFetching: false,
  invalidItems: [],
  checkedItems: [],
  stagingItems: [],
}
export default (state = initialState, action) => {
  switch (action.type) {
    case types.ITEMS_LOAD_BEGAN: {
      return Object.assign({}, state, { isFetching: true })
    }
    case types.ITEMS_LOAD_FAIL: {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.errors,
      })
    }
    case types.ITEMS_LOAD_SUCCESS: {
      const { items, sort, where, totalRows, rowStart } = action
      const newState = Object.assign({}, state)
      newState.isFetching = false
      if (newState.where !== where || newState.sort !== sort) {
        newState.source = []
      }
      newState.sort = sort
      newState.where = where

      // Verify if the items list length is equal to the totalRows
      while (newState.source.length < totalRows) {
        const newItem = {
          virtualIndex: newState.source.length,
          document: null,
          status: Status.LAZZY,
        }
        newState.source.push(newItem)
      }

      items.forEach((document, index) => {
        // Get the item from the list and sets the document attibute and changes the document Status to LOADED
        var initialItem = newState.source[index + rowStart]
        initialItem.document = document
        initialItem.status = Status.LOADED
      })

      return newState
    }

    case types.REMOVE_ITEM: {
      const { rowIndex, schema, lang } = action
      const newState = Object.assign({}, state)
      const documentId = state.source[rowIndex].document.id
      addStaging(newState, documentId, Status.DELETED, null, schema, lang)
      addToHistoryChanges(newState, documentId, Status.DELETED, null)
      return newState
    }
    case types.ADD_ITEM: {
      const { id, schema, lang } = action
      const newState = Object.assign({}, state)
      addStaging(newState, id, Status.NEW, null, schema, lang)
      addToHistoryChanges(newState, id, Status.NEW, null)
      return newState
    }
    // case types.SAVE_ITEMS_CHANGES: {
    //   return state
    // }
    default:
      return state
  }
}

const addToHistoryChanges = (newState, id, status, changes) => {
  newState.historyChanges.push({ id: id, status: status, changes: changes })
  newState.historyIndex++
}

const addStaging = (newState, id, status, changes, schema, lang) => {
  const { staging, source } = newState
  const newStagingDocument = {}
  const item = source.find(item => item.document && item.document.id === id)
  if (changes) {
    Object.keys(changes).forEach(fieldName => {
      const change = changes[fieldName]
      const field = schema[fieldName]
      if (field && field.type === 'object') {
        newStagingDocument[fieldName] = {}
        Object.keys(change.value).forEach(key => {
          newStagingDocument[fieldName][key] = change.value[key]
        })
      } else {
        newStagingDocument[fieldName] = change.value
      }
    })
  }

  newState.stagingItems.push(id)

  if (!staging[id]) {
    staging[id] = {}
  }

  // Shallow merge of the existing staging with the new staging

  staging[id].document = Object.assign(
    {},
    staging[id].document,
    newStagingDocument
  )
  // If the item has status DELETED, keep that status
  staging[id].status =
    staging[id].status && staging[id].status === Status.DELETED
      ? staging[id].status
      : status

  // Validate the document usign the JSONSchema

  const documentToValidate = Object.assign(
    {},
    item ? item.document : {},
    staging[id].document
  )
  staging[id].validationErrors = validateDocument(
    schema,
    lang,
    documentToValidate
  )

  if (staging[id].validationErrors) {
    newState.invalidItems.push(id)
  }
}

const validateDocument = (schema, lang, documentToValidate) => {
  const validate = ajv.compile(schema)
  const valid = validate(documentToValidate)
  console.log(`isValid:${valid}`)
  if (!valid) {
    validate.errors.forEach(error => {
      if (error.keyword === 'required') {
        error.dataPath = `.${error.params.missingProperty}`
      }
    })
  }
  ajvLocalize[lang](validate.errors)
  return validate.errors
}
