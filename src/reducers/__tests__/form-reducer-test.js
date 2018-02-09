import reducer from '../form-reducer'
describe('Filter Reducer', () => {
  it('WHEN unkown action is passed THEN must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: [],
    })
  })
})
