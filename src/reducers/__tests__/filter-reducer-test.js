import reducer from '../filter-reducer'
import * as types from '../../actions/ActionTypes'

describe('Filter Reducer', () => {
  it('WHEN unkown action is passed THEN must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: [],
    })
  })

  it('WHEN CHANGE_CHECKED_FILTER action THEN the isSelectedFilterActive property change to True', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: false,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: [],
        },
        { type: types.CHANGE_CHECKED_FILTER }
      )
    ).toEqual({
      isSelectedFilterActive: true,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: [],
    })
  })

  it('WHEN CHANGE_CHECKED_FILTER action THEN the isSelectedFilterActive property change to False', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: true,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: [],
        },
        { type: types.CHANGE_CHECKED_FILTER }
      )
    ).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: [],
    })
  })

  it('WHEN CHANGE_INVALID_ITEMS_FILTER action THEN the isInvalidFilterActive property change to True', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: false,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: [],
        },
        { type: types.CHANGE_INVALID_ITEMS_FILTER }
      )
    ).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: true,
      hiddenFields: [],
    })
  })

  it('WHEN CHANGE_STAGING_FILTER action THEN the isStagingFilterActive property change to True', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: false,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: [],
        },
        { type: types.CHANGE_STAGING_FILTER }
      )
    ).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: true,
      isInvalidFilterActive: false,
      hiddenFields: [],
    })
  })

  it('WHEN CHANGE_COLUMN_VISIBILITY of "fieldA" to visible=false  action THEN the hiddenFields contains "fieldA"', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: false,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: [],
        },
        {
          type: types.CHANGE_COLUMN_VISIBILITY,
          field: 'fieldA',
          visible: false,
        }
      )
    ).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: ['fieldA'],
    })
  })

  it('WHEN CHANGE_COLUMN_VISIBILITY of "fieldA" to visible=true action THEN the hiddenFields does not  contains "fieldA"', () => {
    expect(
      reducer(
        {
          isSelectedFilterActive: false,
          isStagingFilterActive: false,
          isInvalidFilterActive: false,
          hiddenFields: ['fieldA', 'fieldB', 'fieldC'],
        },
        {
          type: types.CHANGE_COLUMN_VISIBILITY,
          field: 'fieldA',
          visible: true,
        }
      )
    ).toEqual({
      isSelectedFilterActive: false,
      isStagingFilterActive: false,
      isInvalidFilterActive: false,
      hiddenFields: ['fieldB', 'fieldC'],
    })
  })
})
