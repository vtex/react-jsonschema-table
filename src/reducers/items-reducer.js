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
      addStaging(newState, id, Status.NEW, { id: { value: id } }, schema, lang)
      addToHistoryChanges(newState, id, Status.NEW, null)
      return newState
    }

    case types.UPDATE_ITEM: {
      const { id, schema, changes, lang } = action
      const newState = Object.assign({}, state)
      const changesKey = Object.keys(changes)[0]
      let hydratedChanges = changes
      if (typeof changes[changesKey].value === 'object' && state.staging[id].document[changesKey]) {
        // TO DO: make deep merge if field is object inside object inside object...
        hydratedChanges[changesKey] = {
          value: {
            ...state.staging[id].document[changesKey],
            ...changes[changesKey].value,
          }
        }
      }
      addStaging(newState, id, null, hydratedChanges, schema, lang)
      addToHistoryChanges(newState, id, null, hydratedChanges)
      return newState
    }

    case types.CANCEL_STAGING: {
      const newState = Object.assign({}, state)
      newState.staging = {}
      newState.stagingItems = []
      newState.invalidItems = []
      return newState
    }

    case types.SAVE_ITEMS_CHANGES_BEGAN: {
      return Object.assign({}, state, { isFetching: true })
    }

    case types.SAVE_ITEMS_CHANGES_FAIL: {
      return Object.assign({}, state, {
        isFetching: false,
        errors: action.errors,
      })
    }

    case types.CHECK_ITEM_CHANGE: {
      const { id, checked } = action
      const newState = Object.assign({}, state)
      if (checked && !newState.checkedItems.includes(id)) {
        newState.checkedItems.push(id)
      }
      if (!checked) {
        if (!id) newState.checkedItems = []
        else {
          newState.checkedItems = newState.checkedItems.filter(
            item => item !== id
          )
        }
      }
      return newState
    }

    case types.SAVE_ITEMS_CHANGES_COMPLETE: {
      const { errors, notSavedIds } = action
      const newState = Object.assign({}, state, {
        isFetching: false,
        errors: errors,
      })
      console.log(newState.staging)
      const stagingIds = Object.keys(newState.staging)
      console.log('stagingIds:', stagingIds)
      for (const documentId of stagingIds) {
        console.log('documentId', documentId)
        if (notSavedIds && notSavedIds.includes(documentId)) {
          continue
        }
        const stagingItem = newState.staging[documentId]
        console.log('stagingItem', documentId)
        if (stagingItem.status === Status.LOADED) {
          const loadedItem = newState.source.find(
            item => item.document && item.document.id === documentId
          )
          loadedItem.document = Object.assign(
            {},
            loadedItem.document,
            stagingItem.document
          )
          delete newState.staging[documentId]
          newState.stagingItems = newState.stagingItems.filter(
            stagingId => stagingId !== documentId
          )
          continue
        }

        if (stagingItem.status === Status.NEW) {
          const newItem = Object.assign(
            {},
            { document: newState.staging[documentId].document },
            {
              status: Status.LOADED,
            }
          )
          newState.source.push(newItem)
          delete newState.staging[documentId]
          newState.stagingItems = newState.stagingItems.filter(
            stagingId => stagingId !== documentId
          )
          continue
        }

        if (stagingItem.status === Status.DELETED) {
          newState.source = newState.source.filter(
            item => item.document.id !== documentId
          )
          delete newState.staging[documentId]
          newState.stagingItems = newState.stagingItems.filter(
            stagingId => stagingId !== documentId
          )
          continue
        }
      }
      return newState
    }

    case types.COPY_FROM_SELECTED_RANGE: {
      const { changes, schema, lang } = action
      const newState = Object.assign({}, state)

      changes.forEach(change => {
        addStaging(
          newState,
          change.id,
          change.changes['id'] ? Status.NEW : null,
          change.changes,
          schema,
          lang
        )
      })
      return newState
    }
    case types.PASTE_DATA: {
      return state
    }

    case types.UNDO_CHANGE: {
      const newState = Object.assign({}, state)
      const { schema, lang } = action

      newState.staging = {}

      if (newState.historyIndex === 0) {
        return
      }

      newState.historyIndex--

      if (newState.historyIndex === 0) {
        newState.stagingItems = []
        newState.invalidItems = []
      }

      for (let i = 0; i < newState.historyIndex; i++) {
        addStaging(
          newState,
          newState.historyChanges[i].id,
          newState.historyChanges[i].status,
          newState.historyChanges[i].changes,
          schema,
          lang
        )
      }
      return newState
    }
    case types.REDO_CHANGE: {
      const newState = Object.assign({}, state)
      const { schema, lang } = action

      if (newState.historyIndex === newState.historyChanges.length) {
        return
      }

      addStaging(
        newState,
        newState.historyChanges[newState.historyIndex].id,
        newState.historyChanges[newState.historyIndex].status,
        newState.historyChanges[newState.historyIndex].changes,
        schema,
        lang
      )
      newState.historyIndex++
      return newState
    }

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
  staging[id].status = status || staging[id].status
  // staging[id].status && staging[id].status === Status.DELETED
  //  ? staging[id].status
  //  : status

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
  } else {
    newState.invalidItems = newState.invalidItems.filter(item => item !== id)
  }
}

const validateDocument = (schema, lang, documentToValidate) => {
  const validate = ajv.compile(schema)
  const valid = validate(documentToValidate)
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
