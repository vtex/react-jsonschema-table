import * as types from '../actions/ActionTypes'
import { STATUS } from 'table/constants'
import json2csv from 'json2csv'
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

    case types.RECEIVE_ITEMS_FROM_PROPS: {
      const { items } = action.payload
      return {
        ...state,
        source: items,
      }
    }

    case types.EXPORT_CHECKED_ITEMS: {
      const { fields, entityId } = action.payload
      const { checkedItems, source, staging } = state
      const documentsToExport = []

      checkedItems.forEach(key => {
        const sourceDoc = source.find(o => o.document.id === key) || {}
        const stagDoc = staging[key] || {}

        const doc = {
          ...sourceDoc.document,
          ...stagDoc.document,
        }
        documentsToExport.push(doc)
      })

      json2csv({ data: documentsToExport, fields: fields }, function(err, csv) {
        if (err) console.log(err)
        var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        var csvURL = window.URL.createObjectURL(csvData)
        var tempLink = document.createElement('a')
        tempLink.href = csvURL
        tempLink.setAttribute(
          'download',
          entityId + '-' + Date.now() + '.csv'
        )
        tempLink.click()
      })

      return {
        ...state,
        checkedItems: [],
      }
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
          status: STATUS.LAZZY,
        }
        newState.source.push(newItem)
      }

      items.forEach((item, index) => {
        // Get the item from the list and sets the document attibute and changes the document Status to LOADED
        var initialItem = newState.source[index + rowStart]
        initialItem.document = item.document
        initialItem.status = STATUS.LOADED
      })

      return newState
    }

    case types.REMOVE_ITEM: {
      const { rowIndex, schema, lang } = action
      const newState = Object.assign({}, state)
      const documentId = state.source[rowIndex].document.id
      addStaging(newState, documentId, STATUS.DELETED, null, schema, lang)
      addToHistoryChanges(newState, documentId, STATUS.DELETED, null)
      return newState
    }

    case types.DELETE_CHECKED_ITEMS: {
      const newState = Object.assign({}, state)
      newState.checkedItems.slice().reverse().forEach((item, index, ref) => {
        if (newState.staging[item]) {
          delete newState.staging[item]
          const stagingIndex = newState.stagingItems.indexOf(item)
          newState.stagingItems.splice(stagingIndex, 1)
          newState.checkedItems.splice(ref.length - 1 - index, 1)
        } else {
          // To Do: delete document in API (not staged)
        }
      })
      return newState
    }

    case types.ADD_ITEM: {
      const { id, schema, lang } = action
      const newState = Object.assign({}, state)
      addStaging(newState, id, STATUS.NEW, { id: { value: id } }, schema, lang)
      addToHistoryChanges(newState, id, STATUS.NEW, null)
      return newState
    }

    case types.UPDATE_ITEM: {
      const { id, schema, changes, lang } = action
      const newState = Object.assign({}, state)
      const changesKey = Object.keys(changes)[0]
      let hydratedChanges = changes
      if (schema.properties[changesKey].type === 'object' && state.staging[id].document[changesKey]) {
        // TO DO: make deep merge if field is object inside object inside object...
        hydratedChanges[changesKey] = {
          value: {
            ...state.staging[id].document[changesKey],
            ...changes[changesKey].value,
          }
        }
      }
      addStaging(newState, id, null, hydratedChanges, schema, lang, state)
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
        console.log('>> marca esse: ', id)
        newState.checkedItems.push(id)
      }
      if (checked && !id) {
        console.log('>> marca tudo')
        newState.source.forEach(doc => {
          if (!newState.checkedItems.includes(doc.document.id)) {
            newState.checkedItems.push(doc.document.id)
          }
        })
      }
      if (!checked) {
        if (!id) {
          console.log('>> desmarca tudo')
          newState.checkedItems = []
        }
        else {
          console.log('>> desmarca esse: ', id)
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
        if (stagingItem.status === STATUS.LOADED) {
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

        if (stagingItem.status === STATUS.NEW) {
          const newItem = Object.assign(
            {},
            { document: newState.staging[documentId].document },
            {
              status: STATUS.LOADED,
            }
          )
          newState.source.push(newItem)
          delete newState.staging[documentId]
          newState.stagingItems = newState.stagingItems.filter(
            stagingId => stagingId !== documentId
          )
          continue
        }

        if (stagingItem.status === STATUS.DELETED) {
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
          change.changes['id'] ? STATUS.NEW : null,
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

const addStaging = (newState, id, status, changes, schema, lang, state) => {
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

  staging[id].document = {
    ...staging[id].document,
    ...newStagingDocument
  }

  // If the item has status DELETED, keep that status
  const sourceItem = state && state.source.find(i => i.document.id === id)
  staging[id].status = sourceItem ? STATUS.STAGING : status || staging[id].status

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
  if (window && document) {
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
  } return [] // review this fallback
}
