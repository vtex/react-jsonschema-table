import reducer from '../items-reducer'
import * as types from '../../actions/ActionTypes'

describe('Items Reducer', () => {
  it('WHEN unkown action is passed THEN must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      source: [],
      where: null,
      sort: null,
    })
  })

  it('WHEN LoadItems action THEN the state must have the new Items', () => {
    expect(reducer({}, { type: types.ITEMS_LOAD_PAGE })).toEqual({
      source: { 1: {}, 2: {} },
    })
  })
})
