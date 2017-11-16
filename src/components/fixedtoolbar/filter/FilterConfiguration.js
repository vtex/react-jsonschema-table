export default {
  filterableTypes: {
    string: {
      operations: ['equal', 'notEqual', 'contains', 'notContais'],
    },
  },
  operations: {
    equal: {
      label: 'Igual',
      values: 1,
    },
    notEqual: {
      label: 'Diferente',
      values: 1,
    },
    contains: {
      label: 'Contém',
      values: 1,
    },
    notContais: {
      label: 'Não contém',
      values: 1,
    },
  },
}
