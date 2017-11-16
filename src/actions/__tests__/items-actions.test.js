import configureMockStore from 'npm install redux-mock-store --save-dev'
import thunk from 'redux-thunk'
import * as actions from '../items-actions'
import * as types from '../ActionTypes'

jest.mock('FetcherWrapper')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  afterEach
  it('Create an action to load the items from the API', () => {
    const expectedAction = {
      type: types.ITEMS_LOAD_PAGE,
    }
    expect(actions.fetchItems()).toEqual(expectedAction)
  })
})
