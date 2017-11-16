import * as types from '../actions/ActionTypes'
import Status from '../constants/Status'

const initialState = {
  source: [],
  where: null,
  sort: null,
  isFetching: false,
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
      const { documents, sort, where, totalRows, rowStart } = action
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
          virtualID: newState.source.length,
          document: null,
          status: Status.LAZZY,
        }
        newState.source.push(newItem)
      }

      documents.forEach((document, index) => {
        // Get the item from the list and sets the document attibute and changes the document Status to LOADED
        var item = newState.source.items[index + rowStart]
        item.document = document
        item.status = Status.LOADED
      })

      return newState
    }
    // case types.ADD_ITEM: {
    //   return state
    // }
    // case types.SAVE_ITEMS_CHANGES: {
    //   return state
    // }
    default:
      return state
  }
}
