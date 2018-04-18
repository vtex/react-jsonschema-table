import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
import * as actions from '../items-actions'
import * as types from '../ActionTypes'

jest.mock('../FetcherWrapper')

// const middlewares = [thunk]
const middlewares = []
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  afterEach
  it('WHEN FetchItems Action is called, the response MUST have the items list and the total rows', () => {
    const expectedActions = [
      {
        type: types.ITEMS_LOAD_BEGAN,
      },
      {
        type: types.ITEMS_LOAD_SUCCESS,
        items: [{ id: '1' }, { id: '2' }],
        totalRows: 2,
        rowStart: 0,
      },
    ]
    const store = mockStore({})
    return store
      .dispatch(actions.fetchItems())
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  })
})
