import reducer from '../items-reducer'
import * as types from '../../actions/ActionTypes'

describe('Items Reducer', () => {
  it('WHEN unkown action is passed THEN must return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      source: [],
      where: null,
      sort: null,
      isFetching: false,
      staging: {},
      historyChanges: [],
      historyIndex: 0,
      invalidItems: [],
      checkedItems: [],
      stagingItems: [],
    })
  })

  it('WHEN ITEMS_LOAD_BEGAN action THEN the state must have the isFetching = true', () => {
    expect(reducer({}, { type: types.ITEMS_LOAD_BEGAN })).toEqual({
      isFetching: true,
    })
  })

  it('WHEN ITEMS_LOAD_SUCCESS action THEN the state must have the isFetching = false', () => {
    expect(
      reducer(undefined, {
        type: types.ITEMS_LOAD_SUCCESS,
        items: [{ id: '1' }, { id: '2' }],
        totalRows: 2,
        rowStart: 0,
        sort: null,
        where: null,
      })
    ).toEqual({
      isFetching: false,
      source: [
        { document: { id: '1' }, status: 'loaded', virtualIndex: 0 },
        { document: { id: '2' }, status: 'loaded', virtualIndex: 1 },
      ],
      staging: {},
      sort: null,
      where: null,
      historyChanges: [],
      historyIndex: 0,
      invalidItems: [],
      checkedItems: [],
      stagingItems: [],
    })
  })

  it('WHEN ITEMS_LOAD_FAIL action THEN the state contains the error message', () => {
    expect(
      reducer(
        {},
        {
          type: types.ITEMS_LOAD_FAIL,
          errors: ['Error Message'],
        }
      )
    ).toEqual({
      isFetching: false,
      errors: ['Error Message'],
    })
  })

  it('WHEN REMOVE_ITEM action THEN tha staging contains the item with status DELETED', () => {
    expect(
      reducer(
        {
          isFetching: false,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {},
          sort: null,
          where: null,
          historyChanges: [],
          historyIndex: 0,
          invalidItems: [],
          checkedItems: [],
          stagingItems: [],
        },
        {
          type: types.REMOVE_ITEM,
          rowIndex: 0,
          schema: {
            properties: {
              name: { type: 'string', minLength: 1 },
            },
          },
          lang: 'pt-BR',
        }
      )
    ).toEqual({
      isFetching: false,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test2' },
          status: 'loaded',
          virtualIndex: 1,
        },
      ],
      staging: {
        '1': { status: 'deleted', document: {}, validationErrors: null },
      },
      sort: null,
      where: null,
      historyChanges: [{ changes: null, id: '1', status: 'deleted' }],
      historyIndex: 1,
      invalidItems: [],
      checkedItems: [],
      stagingItems: ['1'],
    })
  })

  it('WHEN REMOVE_ITEM action WITH invalid change THEN the staging contains the item with status DELETED AND WITH validation errors', () => {
    expect(
      reducer(
        {
          isFetching: false,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {},
          sort: null,
          where: null,
          historyChanges: [],
          historyIndex: 0,
          invalidItems: [],
          checkedItems: [],
          stagingItems: [],
        },
        {
          type: types.REMOVE_ITEM,
          rowIndex: 0,
          schema: {
            properties: {
              name: { type: 'string', maxLength: 1 },
            },
          },
          lang: 'pt-BR',
        }
      )
    ).toEqual({
      isFetching: false,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test2' },
          status: 'loaded',
          virtualIndex: 1,
        },
      ],
      staging: {
        '1': {
          status: 'deleted',
          document: {},
          validationErrors: [
            {
              dataPath: '.name',
              keyword: 'maxLength',
              message: 'não deve ter mais que 1 caracter',
              params: {
                limit: 1,
              },
              schemaPath: '#/properties/name/maxLength',
            },
          ],
        },
      },
      sort: null,
      where: null,
      historyChanges: [{ changes: null, id: '1', status: 'deleted' }],
      historyIndex: 1,
      invalidItems: ['1'],
      checkedItems: [],
      stagingItems: ['1'],
    })
  })

  it('WHEN ADD_ITEM action WITH  THEN the staging contains the item with status NEW', () => {
    expect(
      reducer(
        {
          isFetching: false,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {},
          sort: null,
          where: null,
          historyChanges: [],
          historyIndex: 0,
          invalidItems: [],
          checkedItems: [],
          stagingItems: [],
        },
        {
          type: types.ADD_ITEM,
          id: '3',
          schema: {
            properties: {
              name: { type: 'string', maxLength: 1 },
            },
          },
          lang: 'pt-BR',
        }
      )
    ).toEqual({
      isFetching: false,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test2' },
          status: 'loaded',
          virtualIndex: 1,
        },
      ],
      staging: {
        '3': {
          status: 'new',
          document: { id: '3' },
          validationErrors: null,
        },
      },
      sort: null,
      where: null,
      historyChanges: [{ changes: null, id: '3', status: 'new' }],
      historyIndex: 1,
      invalidItems: [],
      checkedItems: [],
      stagingItems: ['3'],
    })
  })

  it('WHEN UPDATE_ITEM action WITH valid value THEN the staging contains the item with the updatet version', () => {
    expect(
      reducer(
        {
          isFetching: false,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {},
          sort: null,
          where: null,
          historyChanges: [],
          historyIndex: 0,
          invalidItems: [],
          checkedItems: [],
          stagingItems: [],
        },
        {
          type: types.UPDATE_ITEM,
          id: '2',
          schema: {
            properties: {
              name: { type: 'string' },
            },
          },
          changes: { name: { value: 'test updated' } },
          lang: 'pt-BR',
        }
      )
    ).toEqual({
      isFetching: false,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test2' },
          status: 'loaded',
          virtualIndex: 1,
        },
      ],
      staging: {
        '2': {
          status: 'loaded',
          document: { name: 'test updated' },
          validationErrors: null,
        },
      },
      sort: null,
      where: null,
      historyChanges: [
        {
          changes: { name: { value: 'test updated' } },
          id: '2',
          status: 'loaded',
        },
      ],
      historyIndex: 1,
      invalidItems: [],
      checkedItems: [],
      stagingItems: ['2'],
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_BEGAN action THEN the state must have the isFetching = true', () => {
    expect(reducer({}, { type: types.SAVE_ITEMS_CHANGES_BEGAN })).toEqual({
      isFetching: true,
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action THEN the state must have the isFetching = false', () => {
    expect(
      reducer(
        { staging: {} },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      staging: {},
      errors: null,
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action THEN the state must have the isFetching = false', () => {
    expect(
      reducer(
        { staging: {} },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      staging: {},
      errors: null,
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action THEN the state must have the isFetching = false', () => {
    expect(
      reducer(
        { staging: {} },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      staging: {},
      errors: null,
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action WITH Update change THEN the state must have the UPDATED values', () => {
    expect(
      reducer(
        {
          isFetching: false,
          errors: null,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {
            '2': {
              status: 'loaded',
              document: { name: 'test updated' },
              validationErrors: null,
            },
            '3': {
              status: 'new',
              document: { id: '3', name: 'test new' },
              validationErrors: null,
            },
          },
          sort: null,
          where: null,
          historyChanges: [
            {
              changes: { name: { value: 'test updated' } },
              id: '2',
              status: 'loaded',
            },
            {
              changes: { name: { value: 'test new' } },
              id: '3',
              status: 'new',
            },
          ],
          historyIndex: 2,
          invalidItems: [],
          checkedItems: [],
          stagingItems: ['2', '3'],
        },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      errors: null,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test updated' },
          status: 'loaded',
          virtualIndex: 1,
        },
        {
          document: { id: '3', name: 'test new' },
          status: 'loaded',
        },
      ],
      staging: {},
      sort: null,
      where: null,
      historyChanges: [
        {
          changes: { name: { value: 'test updated' } },
          id: '2',
          status: 'loaded',
        },
        {
          changes: { name: { value: 'test new' } },
          id: '3',
          status: 'new',
        },
      ],
      historyIndex: 2,
      invalidItems: [],
      checkedItems: [],
      stagingItems: [],
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action WITH New Item change THEN the state must have the NEW item', () => {
    expect(
      reducer(
        {
          isFetching: false,
          errors: null,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {
            '3': {
              status: 'new',
              document: { id: '3', name: 'test new' },
              validationErrors: null,
            },
          },
          sort: null,
          where: null,
          historyChanges: [
            {
              changes: { name: { value: 'test new' } },
              id: '3',
              status: 'new',
            },
          ],
          historyIndex: 1,
          invalidItems: [],
          checkedItems: [],
          stagingItems: ['3'],
        },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      errors: null,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
        {
          document: { id: '2', name: 'test2' },
          status: 'loaded',
          virtualIndex: 1,
        },
        {
          document: { id: '3', name: 'test new' },
          status: 'loaded',
        },
      ],
      staging: {},
      sort: null,
      where: null,
      historyChanges: [
        {
          changes: { name: { value: 'test new' } },
          id: '3',
          status: 'new',
        },
      ],
      historyIndex: 1,
      invalidItems: [],
      checkedItems: [],
      stagingItems: [],
    })
  })

  it('WHEN SAVE_ITEMS_CHANGES_COMPLETE action WITH Delete change THEN the state must remove the deleted item', () => {
    expect(
      reducer(
        {
          isFetching: false,
          errors: null,
          source: [
            {
              document: { id: '1', name: 'test' },
              status: 'loaded',
              virtualIndex: 0,
            },
            {
              document: { id: '2', name: 'test2' },
              status: 'loaded',
              virtualIndex: 1,
            },
          ],
          staging: {
            '2': {
              status: 'deleted',
              document: {},
              validationErrors: null,
            },
          },
          sort: null,
          where: null,
          historyChanges: [
            {
              changes: {},
              id: '2',
              status: 'delete',
            },
          ],
          historyIndex: 1,
          invalidItems: [],
          checkedItems: [],
          stagingItems: ['2'],
        },
        { type: types.SAVE_ITEMS_CHANGES_COMPLETE, errors: null }
      )
    ).toEqual({
      isFetching: false,
      errors: null,
      source: [
        {
          document: { id: '1', name: 'test' },
          status: 'loaded',
          virtualIndex: 0,
        },
      ],
      staging: {},
      sort: null,
      where: null,
      historyChanges: [
        {
          changes: {},
          id: '2',
          status: 'delete',
        },
      ],
      historyIndex: 1,
      invalidItems: [],
      checkedItems: [],
      stagingItems: [],
    })
  })
})
