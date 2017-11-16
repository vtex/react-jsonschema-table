{
  source:{}, //Items carregados da API
  staging: {}, // ultimas alteracoes feitas nos items
  invalid: {},
  selected: {},
  historyChanges:[], // hostoticp de altracoes, undo redo
  historyIndex, // index da ultima mudanca aplicada ao staging
  sort, // expressao de como esta ordenado  UIState ????
  where,  // expressao dos filtros aplicados aos dados UIState???
  errorMessages: []   // mensagens de error na store UIState?????
  viewMode: {} // Default, staging, hasEditedItems, hasInvalidItems, hasCheckedItems UIState?????
  filter{filteredStatus:[]} // Filtros ativos segundo o estado do item. UIState?????
}
