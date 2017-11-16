import Reflux from 'reflux'
import _ from 'underscore'
import Actions from '../actions/Actions'
import Status from './Status'
import uuid from 'uuid'
// import CommonConfiguration from '../actions/api/CommonConfiguration'
// import jsonpatch from 'jsonpatch'
import utils from '../utils/utils'
import Ajv from 'ajv'
import ajvLocalize from 'ajv-i18n'
const ajv = new Ajv({ allErrors: true })

/*
 EXEMPLO DA ESTRUTUDA DE DADOS DESSE STORE

 {
 items: [
 {
 virtualID: 0,
 document: { _self: { id: '0' }, email: 'teste0@vtex.com.br', firstName: 'Teste0' }
 },
 {
 virtualID: 1,
 document: { _self: { id: '1' }, email: 'teste1@vtex.com.br', firstName: 'Teste1' }
 }
 ],
 staging: {
 0: {
 document: { firstName: 'Novo Teste0' },
 invalidFields: [],
 status: 'staging',
 isChecked: true
 },
 1: {
 document: { lastName: 'Sobre nome 1', phone: '1234' },
 invalidFields: ['phone'],
 status: 'deleted',
 isChecked: false
 }
 },
 fields:{
 "id": { "label": "id" },
 "email": { "width": 200, "label": "E-mail" },
 "firstName": { "width": 300, "label": "Nome" },
 "lastName": { "width": 300, "label": "Sobrenome" },
 "approved": { "width": 90, "label": "Aprov" },
 "rclastsessiondate": { "width": 300, "label": "Data última navegação" },
 "phone": { "width": 200, "label": "Telefone", "mask": "(99) 99999-9999" },
 "gender": { "width": 300, "label": "Sexo" },
 "nationality": { "width": 300, "label": "Nacionalidade" },
 "document": { "label": "CPF", "width": 300, "mask": "999.999.999-99" }
 },
 view: {
 inputMode: 0,
 inputModeOptions: {
 Default: 0,
 Staging: 1,
 Importing: 2
 }
 hasCheckedItems:false,
 hasEditedItems:false,
 hasInvalidItems:false
 },
 filter: {
 filteredStatus: [STAGING, DELETED],
 isStagingFilterActive:false,
 isSelectedFilterActive:false,
 isInvalidFilterActive:false,
 isChecked: false
 }
 }

 */
var _store = { apps: { entities: { tables: {} } }, appConfiguration: {} }
var _formStore = { context: null, documentId: null, historical: [] }
// Obtem uma instância chamada STORE a partir de uma entidade de dados.
// É possível ter várias estruturas nesse store, uma para cada entidade de dados
function getStore(context) {
  if (!context) {
    return null
  }

  if (!_store[`${context.appName}-${context.entityId}-${context.tableId}`]) {
    _store[`${context.appName}-${context.entityId}-${context.tableId}`] = {
      items: [],
      staging: {},
      historyChanges: [],
      historyIndex: 0,
      fields: _store.appConfiguration[context.appName].resources[
        context.entityId
      ].tables[context.tableId].fields,
      view: {
        inputMode: 0,
        inputModeOptions: {
          Default: 0,
          Staging: 1,
          Importing: 2,
        },
      },
      filter: { filteredStatus: [] },
      sort: '',
      where: '',
      errorMessage: null,
      fileSystemRefs: { toAdd: {}, toDelete: {} },
    }
  }

  return _store[`${context.appName}-${context.entityId}-${context.tableId}`]
}
function updateLinkedFieldValue(linkSpec, linkValue, linkedValue) {
  if (linkedValue) {
    var linkedDocumentId = linkedValue.id
    var relatedStore = getStore({
      appName: linkSpec.relatedApp,
      entityId: linkSpec.link.split('/')[5],
      tableId: linkSpec.relatedTable,
    })
    var linkedDocumentStaging = relatedStore.staging[linkedDocumentId]
    if (linkedDocumentStaging && linkedDocumentStaging.document[linkSpec.linked_field] && linkedDocumentStaging.status === Status.NEW) {
      Object.keys(linkedValue).forEach(key => {
        linkedValue[key] = linkedDocumentStaging.document[key]
      })
    }
  }
}
// Armazena um STORE para uma entidade de dados
// function setStore(context, store) {
// _store.entities[context.entityId].tables[context.tableId] = store
// }
// Retorna, do STORE, o trecho correspondente ao Staging de um item
function getStaging(context, id) {
  var store = getStore(context)
  if (!store.staging[id]) {
    store.staging[id] = {}
  }
  return store.staging[id]
}
// Armazena, no STORE da entidade de dados, algum atributo que sirva de parâmetro para a VIEW
function setViewStore(context, newStore) {
  var viewStore = getStore(context).view
  // Utiliza o extend para fazer o MERGE dos atributos que já existem com o que está sendo definido
  _.extend(viewStore, newStore)
}
function setViewInputMode(context) {
  var store = getStore(context)
  var isStaging = _.some(store.staging, function(item) {
    return (
      item.status === Status.STAGING ||
      item.status === Status.DELETED ||
      item.status === Status.NEW
    )
  })
  var isImporting = _.some(store.staging, function(item) {
    return item.status === Status.IMPORTED
  })
  var inputMode = isStaging
    ? store.view.inputModeOptions.Staging
    : store.view.inputModeOptions.Default
  inputMode = isImporting ? store.view.inputModeOptions.Importing : inputMode
  setViewStore(context, { inputMode })
}
// function getLinkFieldsByReferencedEntity(entityName) {
//   var linkFields = {}
//   _.map(_store.appConfiguration.vtable, function(form) {
//     if (form.model !== entityName) {
//       _.map(form.fields, function(field, key) {
//         if (field.relatedEntityId && field.relatedEntityId === entityName) {
//           field.dataEntityName = form.dataEntityName
//           linkFields[key] = field
//         }
//       })
//     }
//   })
//   return linkFields
// }
function getReferencedEntities(form) {
  var relatedEntities = []
  _.map(form.fields, function(definition) {
    if (definition.relatedEntityId) {
      relatedEntities.push(definition.relatedEntityId)
    }
  })
  return relatedEntities
}
function getLinkFields(context) {
  var linkFields = {}
  var form =
    _store.appConfiguration[context.appName].resources[context.entityId].tables[
      context.tableId
    ]
  _.map(form.fields, function(field, key) {
    if (field.link) {
      linkFields[key] = field
    }
  })
  return linkFields
}
function validateLinkedFieldsValue(linkFields, item) {
  _.map(linkFields, function(linkSpec, key) {
    if (linkSpec.type === 'string' && item.document) {
      updateLinkedFieldValue(linkSpec, item.document[key], item.document[key + '_linked'])
    } else if (linkSpec.type === 'array' && item.document) {
      _.each(item.document, function(document) {
        updateLinkedFieldValue(linkSpec, document[key], document[key + '_linked'])
      })
    }
  })
}
function getFieldSearchTerms(fields) {
  var allFields = []
  _.map(fields, function(props, fieldName) {
    allFields.push(fieldName)
    if (props.link) {
      allFields.push(fieldName + '_linked')
    }
  })

  return allFields
}

class VTableStore extends Reflux.Store {
  contructor() {
    this.listenTo(
      Actions.configurationLoad.completed,
      this.onConfigurationLoadCompleted
    )
    this.listenTo(
      Actions.documentLoadPage.completed,
      this.onDocumentLoadPageCompleted
    )
    this.listenTo(Actions.documentStaging, this.onDocumentStaging)
    this.listenTo(Actions.markDocumentToRemove, this.onRemoveItem)
    this.listenTo(Actions.documentCheck, this.onDocumentCheck)
    this.listenTo(Actions.documentCancelStaging, this.onDocumentCancelStaging)
    this.listenTo(Actions.deleteDocument, this.onDeleteDocumentCompleted)
    this.listenTo(Actions.loadDocumentLink.completed, this.onLoadDocumentLink)
    this.listenTo(Actions.clearErrorMessages, this.onClearErrorMessages)
    this.listenTo(Actions.sesChange, this.onLoadDocumentSES)
    this.listenTo(
      Actions.documentSaveAll.completed,
      this.onDocumentSaveAllCompleted
    )
    this.listenTo(Actions.checkedFilter, this.onCheckedFilter)
    this.listenTo(Actions.stagingFilter, this.onStagingFilter)
    this.listenTo(Actions.invalidFilter, this.onInvalidFilter)
    this.listenTo(Actions.addDocument, this.onAddDocument)
    this.listenTo(Actions.importDocument, this.onImportDocument)
    this.listenTo(Actions.cancelImport, this.onCancelImport)
    this.listenTo(Actions.addDocumentAndOpen, this.onAddDocumentAndOpenInform)
    this.listenTo(Actions.openDocumentInForm, this.onOpenDocumentInForm)
    this.listenTo(Actions.loadEntityPage, this.onLoadEntityPage)
    this.listenTo(Actions.changeRowStatus, this.onChangeRowStatus)
    this.listenTo(Actions.deleteCheckedRows, this.onDeleteCheckedRows)
    this.listenTo(
      Actions.changeColumnVisibility,
      this.onColumnVisibilityChange
    )
    this.listenTo(Actions.showAllColumns, this.onshowAllColumns)
    this.listenTo(
      Actions.exportCheckedItems.completed,
      this.onExportCheckedItems
    )
    this.listenTo(Actions.pasteData, this.onPasteData)
    this.listenTo(
      Actions.copyFromSelectedRange,
      this.onCopyDataFromSelectedRange
    )
    this.listenTo(Actions.undo, this.onUndo)
    this.listenTo(Actions.redo, this.onRedo)
  }

  onPasteData(context, text, cellA, cellB, columns) {
    if (!cellA && !cellB) {
      return
    }
    const minRow = Math.min(cellA.row, cellB.row)
    const maxRow = Math.max(cellA.row, cellB.row)
    const minCol = Math.min(cellA.col, cellB.col)
    const maxCol = Math.max(cellA.col, cellB.col)
    const clipRows = this.extractTextFromClipBoard(text)
    const finalSelectedCell = {}
    let rowQuotient = Math.floor((maxRow - minRow + 1) / clipRows.length)
    let colQuotient = Math.floor((maxCol - minCol + 1) / clipRows[0].length)
    rowQuotient = rowQuotient === 0 ? 0 : rowQuotient - 1
    colQuotient = colQuotient === 0 ? 0 : colQuotient - 1
    var documents = this.getDocuments(context)
    var documentsCount = documents.length - 1

    for (let i = 0; i <= rowQuotient; i++) {
      for (let ii = 0; ii < clipRows.length; ii++) {
        const changes = {}
        const rowIndex = minRow + ii + i * clipRows.length
        finalSelectedCell.row = rowIndex
        for (let j = 0; j <= colQuotient; j++) {
          for (let jj = 0; jj < clipRows[0].length; jj++) {
            const colIndex = minCol + jj + j * clipRows[0].length
            finalSelectedCell.col = colIndex
            const value = clipRows[ii][jj]
            if (colIndex > columns.length - 1) {
              break
            }
            const fieldName = columns[colIndex].fieldName
            const parsedValue = this.parseValue(columns[colIndex].type, value)
            changes[fieldName] = { value: parsedValue }
          }
        }

        if (rowIndex > documentsCount) {
          var newId = changes.id ? changes.id.value : uuid.v4()
          changes.id = {value: newId}
          this.onDocumentStaging(context, newId, Status.NEW, changes)
        } else {
          const id = documents[rowIndex].document.id
          this.onDocumentStaging(context, id, null, changes)
        }
      }
    }
    this.trigger(context)
  }

  parseValue(type, value) {
    var parsedValue = value
    switch (type) {
      case 'boolean':
        parsedValue = JSON.parse(value !== null ? value.toLowerCase() : value)
        break
      case 'text':
        break
      case 'string':
        break
      case 'number':
        parsedValue = JSON.parse(value)
        break
      case 'integer':
        parsedValue = JSON.parse(value)
        break
      case 'array':
        parsedValue = value.split(',')
        break
      case 'object':
        parsedValue = JSON.parse(value)
        break
    }
    return parsedValue
  }

  onCopyDataFromSelectedRange(
    context,
    selectedCellRange,
    fillHandleCellRange,
    columns
  ) {
    const minRow = Math.min(
      selectedCellRange.cellA.row,
      selectedCellRange.cellB.row
    )
    const maxRow = Math.max(
      selectedCellRange.cellA.row,
      selectedCellRange.cellB.row
    )
    const minCol = Math.min(
      selectedCellRange.cellA.col,
      selectedCellRange.cellB.col
    )
    const maxCol = Math.max(
      selectedCellRange.cellA.col,
      selectedCellRange.cellB.col
    )
    const minFHRow = Math.min(
      fillHandleCellRange.cellA.row,
      fillHandleCellRange.cellB.row
    )
    const maxFHRow = Math.max(
      fillHandleCellRange.cellA.row,
      fillHandleCellRange.cellB.row
    )
    const minFHCol = Math.min(
      fillHandleCellRange.cellA.col,
      fillHandleCellRange.cellB.col
    )
    const maxFHCol = Math.max(
      fillHandleCellRange.cellA.col,
      fillHandleCellRange.cellB.col
    )
    const fhRowsLenght = maxFHRow - minFHRow + 1
    const fhColsLenght = maxFHCol - minFHCol + 1
    const rowsLength = maxRow - minRow + 1
    const colsLenght = maxCol - minCol + 1
    const toUp = maxFHRow < minRow
    const toLeft = maxFHCol < minCol
    for (let i = 0; i < fhRowsLenght; i++) {
      // let colQuotient = Math.floor((maxCol - minCol + 1) / clipRows[0].length)
      const toRowIndex = toUp ? maxFHRow - i : i + minFHRow
      const rowQuotient = Math.floor(i / rowsLength)
      const fromRowIndex = toUp ? (maxRow - (i - rowQuotient * rowsLength)) : (i - rowQuotient * rowsLength + minRow)
      const changes = {}
      for (let j = 0; j < fhColsLenght; j++) {
        const toColIndex = toLeft ? maxFHCol - j : j + minFHCol
        const colQuotient = Math.floor(j / colsLenght)
        const fromColIndex = toLeft ? (maxCol - (j - colQuotient * colsLenght)) : (j - colQuotient * colsLenght + minCol)
        const fieldNameTo = columns[toColIndex].fieldName
        const filedNameFrom = columns[fromColIndex].fieldName
        const valueToCopy = this.getDocuments(context)[fromRowIndex].document[
          filedNameFrom
        ]
        changes[fieldNameTo] = { value: valueToCopy }
      }
      const id = this.getDocuments(context)[toRowIndex].document.id
      this.onDocumentStaging(context, id, null, changes)
    }
  }

  extractTextFromClipBoard(text) {
    // Cada linha é separada por "\n" CarriageReturn.
    var clipRows = text.split('\n')
    // tira o caracter de NewLine "\n"
    // clipRows = _.map(clipRows, clipRow =>
    // clipRow.replace(String.fromCharCode(10), '')
    // )
    // Apaga as linhas sem valor
    clipRows = _.compact(clipRows)
    // cada valor na linha esta separado por "tab", faz split para criar um array em cada linha
    clipRows = _.map(clipRows, clipRow => clipRow.split('\t'))
    return clipRows
  }

  onChangeRowStatus(context, virtualID, status) {
    var storeRef = getStore(context)
    storeRef.items[virtualID].status = status
    this.trigger(context)
  }
  onDeleteCheckedRows(context) {
    const that = this
    var store = getStore(context)
    // var checkedDocuments = _.where(store.staging, { isChecked: true })
    var checkedIds = _.keys(_.pick(store.staging, function(item) {
      return item.isChecked
    }))
    _.each(checkedIds, function(id) {
      if (store.staging[id].status === Status.NEW) {
        delete store.staging[id]
      } else {
        that.onDocumentStaging(context, id, Status.DELETED, {})
      }
    })
    this.setIsCheckedFilter(context, false)
    this.setIsStagingFilter(context, false)
    setViewStore(context, { hasCheckedItems: false, hasEditedItems: true })
    this.trigger(context)
  }
  onLoadEntityPage(context) {
    var store = getStore(context)
    store.items = []
  }
  onImportDocument(document, context) {
    var storeRef = getStore(context)
    var newId = uuid.v4()
    document._self = {}
    document.id = newId
    var newDocument = {
      document: document,
      status: Status.IMPORTED,
    }
    newDocument.virtualID = storeRef.items.length + 1
    storeRef.staging[newId] = newDocument
    setViewInputMode(context)
    this.trigger(context)
  }
  onCancelImport(context) {
    var store = getStore(context)
    store.staging = _.each(store.staging, function(item, key, list) {
      if (item.status === Status.IMPORTED) {
        delete list[key]
      }
    })
    setViewInputMode(context)
    this.trigger(context)
  }
  onAddDocument(context, id) {
    var fields = getStore(context).fields
    const newId = id || uuid.v4()
    const changes = { id: {value: newId}}

    Object.keys(fields).forEach(key => {
      if (fields[key].default !== undefined) {
        changes[key] = { value: fields[key].default }
      }
    })
    this.onDocumentStaging(context, newId, Status.NEW, changes)
  }
  onAddDocumentAndOpenInform(context, id) {
    var newId = id || uuid.v4()
    this.onDocumentStaging(context, newId, Status.NEW, { id: { value: newId }})
    _formStore.context = context
    _formStore.documentId = newId
    _formStore.historical.push({ context: context, documentId: newId })
    setViewStore(context, { hasEditedItems: true })
    this.trigger(context)
  }
  // Evento chamado depois de que foi carregado unicamente um documento
  onLoadDocumentLink(context, key, document, callback) {
    var storeRef = getStore(context)
    var newDocument = {
      virtualID: storeRef.items.length,
      document: document,
      status: Status.LOADED,
    }
    storeRef.items.push(newDocument)
    _formStore.context = context
    _formStore.documentId = document.id
    _formStore.callback = callback
    _formStore.historical.push({
      context: context,
      documentId: document.id,
    })
    this.trigger(context)
  }
  onClearErrorMessages(context) {
    var store = getStore(context)
    store.errorMessage = null
    this.trigger(context)
  }
  // onLoadDocumentSES(context, data) {
    // if (data.operation !== 'update') {
     // return
    // }
    // var storeRef = getStore(context)
    // var itemToUpdate = _.find(storeRef.items, function(item) {
      // return (
      // item.document &&
      // item.document._self.href ===
      //   CommonConfiguration.masterDataHost + data.href
      //)
    // })
    // var document = jsonpatch.apply_patch(itemToUpdate.document, data.patch)
    // itemToUpdate.document = document
    // itemToUpdate.status = Status.SESUPDATED
    // this.trigger(context)
  // },
  // Evento chamado depois que uma documento é deletado
  onDeleteDocumentCompleted(context, key) {
    var store = getStore(context)
    store.items = _.reject(store.items, function(item) {
      return item.document.id === key
    })
  }
  // Evento chamado assim que a tela é carregada e a configuração de todas as tabelas são carregadas através da API
  onConfigurationLoadCompleted(configuration) {
    _store.appConfiguration = configuration
    this.trigger()
  }
  // Evento chamado sempre que uma nova página de documentos é carregada a partir da API
  onDocumentLoadPageCompleted(
    context,
    documents,
    rowStart,
    totalRows,
    where,
    sort
  ) {
    var storeRef = getStore(context)
    if (typeof documents === 'string') {
      storeRef.errorMessage = documents
      this.trigger(context)
      return
    }
    if (storeRef.sort !== sort) {
      storeRef.items = []
      storeRef.sort = sort
    }
    if (storeRef.where !== where) {
      storeRef.items = []
      storeRef.where = where
    }
    // var linkFields = getLinkFields(entityName);
    // Verifica se a lista de documentos está carregada com o número de itens correspondente ao total de documentos da consulta
    while (storeRef.items.length < totalRows) {
      var newDocument = {
        virtualID: storeRef.items.length,
        document: null,
        status: Status.LAZZY, // Esse status indica que aqui só existe uma representação do documento, mas ele ainda não foi carregado de fato
      }
      storeRef.items.push(newDocument)
    }
    var i = 0
    // Percorre a lista de documentos que foi recebida da API
    _.map(documents, function(document) {
      var index = i + rowStart // Calcula a posição do documento na lista global

      // Obtem o item a partir do índice e popula o atributo document. Também muda o status para LOADED para indicar que esse documento já está carregado em memória
      var item = storeRef.items[index]
      item.document = document
      item.status = Status.LOADED
      i++
    })

    // setStore(context, storeRef)
    this.trigger(context)
  }
  onUndo(context) {
    var store = getStore(context)
    store.staging = {}

    if (store.historyIndex === 0) {
      return
    }

    store.historyIndex--

    if (store.historyIndex === 0) {
      this.onDocumentCancelStaging(context)
    }

    for (let i = 0; i < store.historyIndex; i++) {
      this.applyStaging(context, store.historyChanges[i].id, store.historyChanges[i].status, store.historyChanges[i].changes)
    }
    this.trigger(context)
  }
  onRedo(context) {
    var store = getStore(context)

    if (store.historyIndex === store.historyChanges.length) {
      return
    }

    this.applyStaging(context, store.historyChanges[store.historyIndex].id, store.historyChanges[store.historyIndex].status, store.historyChanges[store.historyIndex].changes)
    store.historyIndex++
    this.trigger(context)
  }

  applyStaging(context, id, status, changes) {
    // Obtem a estrutura de Staging que corresponde a esse item
    var store = getStore(context)
    var staging = getStaging(context, id)
    var invalidFields = []
    var stagingDocument = {}
    const item = _.find(store.items, function(item) {
      return item.document && item.document.id === id
    })
    const that = this
    // Cria uma nova estrutura das alterações, indicando qual campo está com o valor incorreto, de acordo com o atributo pattern do modelo
    _.keys(changes).map(function(fieldName) {
      var change = changes[fieldName]
      var field = store.fields[fieldName]
      if (field && field.type === 'object') {
        stagingDocument[fieldName] = {}
        Object.keys(change.value).forEach((key) => {
          stagingDocument[fieldName][key] = change.value[key]
        })
      } else {
        stagingDocument[fieldName] = change.value
      }
      if (change.hasError) {
        invalidFields.push(fieldName)
      }

      // identifica se o field tem integração com o sistema de arquivos
      // Se o field for um link tenta encontrar o linked_value para exibir os detalhes
      if (field && field.type === 'string' && field.link) {
        if (!_.has(changes, fieldName + '_linked')) {
          // tenta procurar na lista de documentos carregados
          const linkedValue = that.findLinkedValue(context, fieldName, change.value)
          stagingDocument[fieldName + '_linked'] = linkedValue
        }
      }
      if (field &&
        field.type === 'array' &&
        field.items.type === 'string' &&
        field.items.format === 'uri'
      ) {
        // var item = _.find(store.items, function(item) {
        //   return item.document && item.document.id === id
        // })
        var uriToDelete = _.difference(
          item.document[fieldName],
          stagingDocument[fieldName]
        )
        if (!store.fileSystemRefs.toDelete[id]) {
          store.fileSystemRefs.toDelete[id] = []
        }
        var uriToAdd = _.difference(
          stagingDocument[fieldName],
          item.document[fieldName]
        )
        if (!store.fileSystemRefs.toAdd[id]) {
          store.fileSystemRefs.toAdd[id] = []
        }
        _.each(uriToDelete, function(uri) {
          if (_.indexOf(store.fileSystemRefs.toDelete[id], uri) === -1) {
            store.fileSystemRefs.toDelete[id].push(uri)
          }
        })
        _.each(uriToAdd, function(uri) {
          if (_.indexOf(store.fileSystemRefs.toAdd[id], uri) === -1) {
            store.fileSystemRefs.toAdd[id].push(uri)
          }
        })
      }

      // Se o field for link tenta resolver se existe ou não

      // Busca primeiro nos documentos carregados

      // Busca no Master Data
      // Faz diff das uri dos arquivos para saber quais referencias tem que tirar e quais adicionar
    })

    // Faz o merge do atributo document com as novas alterações que foram recebidas. É preciso fazer esse merge porque pode ter ocorrido alguma alteração anterior e se não fizer o merge somente a última modificação será valida.
    if (!staging.document) {
      staging.document = {}
    }

    staging.document = _.extend(staging.document, stagingDocument)

    staging.invalidFields = invalidFields

    if (status) {
      staging.status = status
      staging.isChecked = status !== Status.DELETED ? staging.isChecked : false
    } else {
      staging.status = staging.status === Status.NEW ||
      staging.status === Status.DELETED
      ? staging.status
      : Status.STAGING // Define o status do item como STAGING se for um documento carregado da API para indicar que esse item sofreu alguma alteração e essa ainda não foi salva
    }
    let documentToValidate = utils.extend(true, {}, item ? item.document : {})
    documentToValidate = utils.extend(true, documentToValidate, staging.document)
    // const schema = this.getSchema(context)
    // const validate = ajv.compile(schema)
    // é Necessario tirar os null por que o MD retorna null nos fields que não foram definidos
    // documentToValidate = _.pick(documentToValidate, function(attr) {
      // return attr !== null
    // })
    // staging.isValid = validate(documentToValidate)
    staging.validationErrors = this.validateDocument(context, documentToValidate)
    staging.isValid = !staging.validationErrors || staging.validationErrors.length === 0

    const hasInvalidItems = _.some(store.staging, function(staging) {
      return staging && !staging.isValid
    })
    // Define na estrutura da view o atributo isStaging, para indicar se há algum documento nos status STAGING ou DELETED, ou seja, se há alterações que ainda não foram publicadas.
    setViewStore(context, { hasEditedItems: true, hasInvalidItems: hasInvalidItems})
  }

  validateDocument(context, documentToValidate) {
    const schema = this.getSchema(context)
    const validate = ajv.compile(schema)
    // é Necessario tirar os null por que o MD retorna null nos fields que não foram definidos
    documentToValidate = _.pick(documentToValidate, function(attr) {
      return attr !== null
    })
    const valid = validate(documentToValidate)
    if (!valid) {
      _.each(validate.errors, (error) => {
        if (error.keyword === 'required') {
          error.dataPath = '.' + error.params.missingProperty
        }
      })
    }
    const lang = window.vtex.selectedLanguageCode || 'pt-BR'
    const lang2 = lang === 'pt-BR' ? 'pt-BR' : lang.split('-')[0]
    ajvLocalize[lang2](validate.errors)
    return validate.errors
  }
  // Evento chamado quando ocorre uma alteração em um documento
  onDocumentStaging(context, id, status, changes) {
    var store = getStore(context)

    store.historyChanges.push({id: id, status: status, changes: changes})
    store.historyIndex++

    this.applyStaging(context, id, status, changes)
    this.trigger(context)
  }
  onRemoveItem(context, rowIndex) {
    var store = getStore(context)
    var item = store.items[rowIndex]
    var id = item.document.id
    this.onDocumentStaging(context, id, Status.DELETED, {})
  }
  onDocumentCancelStaging(context) {
    console.log('onDocumentCancelStaging() in VTableStore.js')
    // Cancela todas as alterações pendentes de gravação
    // e volta os documentos para o estato original, tal como é obtido da API
    var store = getStore(context)
    store.staging = {}
    store.filter.filteredStatus = _.without(
      store.filter.filteredStatus,
      Status.STAGING,
      Status.DELETED,
      Status.NEW,
      Status.SELECTED
    )
    setViewStore(context, { hasEditedItems: false, hasCheckedItems: false, hasInvalidItems: false })
    this.trigger(context)
  }
  onDocumentCheck(context, id, value) {
    // Se for informado um virtualID, aplicar o flag de check somente para esse item
    if (id) {
      var staging = getStaging(context, id)
      staging.isChecked = value
    } else {
      // Se não for informado um virtualID, aplicar o check para todos os itens da lista
      var store = getStore(context)
      _.map(store.staging, function(item) {
        item.isChecked = value
      })
      _.map(store.items, function(item) {
        if (item.document)var staging = store.staging[item.document.id]
        if (staging) {
          staging.isChecked = value
        }
      })
    }
    // Verificar se há algum item selecionado na lista
    var hasCheckedItems = _.some(getStore(context).staging, function(staging) {
      return staging && staging.isChecked
    })

    // Se não houver nenhum item selecionado, desliga o filtro
    if (!hasCheckedItems) {
      this.setIsCheckedFilter(context, false)
    }

    // Define na ViewStore o status da tela para o modo de seleção de registros
    setViewStore(context, { hasCheckedItems: hasCheckedItems })
    this.trigger(context)
  }
  onDocumentSaveAllCompleted(context, errorMessage) {
    var store = getStore(context)
    if (errorMessage) {
      store.errorMessage = errorMessage
      this.trigger(context)
      return
    }
    _.map(store.items, function(item) {
      if (item.status !== Status.LAZZY) {
        var staging = store.staging[item.document.id] || {}
        item.document = utils.extend(true, {}, item.document, staging.document)
      }
    })
    _.map(store.staging, function(staging, key) {
      if (staging.status === Status.NEW) {
        staging.status = Status.LOADED
        store.items.push(staging)
      }
      if (staging.status === Status.DELETED) {
        store.items = _.reject(store.items, function(item) {
          if (item.status !== Status.LAZZY) {
            return item.document.id === key
          }
        })
      }
    })
    this.onDocumentCancelStaging(context)
  }

  onStagingFilter(context, value) {
    this.setIsStagingFilter(context, value)
  }
  onCheckedFilter(context, value) {
    this.setIsCheckedFilter(context, value)
  }
  onInvalidFilter(context, value) {
    this.setIsInvalidFilter(context, value)
  }
  getAppConfiguration(context) {
    if (!context) {
      return _store.appConfiguration
    }
    var config =
      _store.appConfiguration[context.appName].resources[context.entityId]
        .tables[context.tableId]
    config = _.extend(config, {
      fieldSearchTerms: getFieldSearchTerms(config.fields),
    })
    return _.extend(config, {
      relatedEntities: getReferencedEntities(config),
    })
  }

  getEntityTables(context) {
    const tables = []
    _.each(
      _store.appConfiguration[context.appName].resources[context.entityId]
        .tables,
      function(table) {
        tables.push({ id: table.id, name: table.label })
      }
    )
    return tables
  }

  getAppResources(context) {
    const resources = []
    _.each(_store.appConfiguration[context.appName].resources, function(
      value,
      key
    ) {
      resources.push(key)
    })
    return resources
  }

  getSchema(context) {
    const schema = _store.appConfiguration[context.appName].resources[context.entityId]
    .tables[context.tableId].model
    return _store.appConfiguration[context.appName].resources[context.entityId].models[schema].schema
  }

  getRequiredFields(context) {
    const requiredFields = []
    const fields = this.getAppConfiguration(context).fields
    _.mapObject(fields, (definition, fieldName) => {
      if (definition.isRequired) {
        requiredFields.push(fieldName)
      }
    })
    return requiredFields
  }

  getAppTitle(context) {
    return _store.appConfiguration[context.appName].title
  }

  onColumnVisibilityChange(context, field, visible) {
    var configuration = this.getAppConfiguration(context)
    if (visible) {
      configuration.hiddenFields = _.without(configuration.hiddenFields, field)
    } else {
      configuration.hiddenFields = configuration.hiddenFields
        ? configuration.hiddenFields
        : []
      configuration.hiddenFields.push(field)
    }
    this.trigger(context)
  }
  onshowAllColumns(context) {
    var configuration = this.getAppConfiguration(context)
    configuration.hiddenFields = []
    this.trigger(context)
  }
  onExportCheckedItems(context, documents) {
    var store = getStore(context)
    _.each(documents, function(document) {
      var staging = store.staging[document.id]
      if (staging) {
        staging.isChecked = false
      }
    })
    this.setIsCheckedFilter(context, false)
    setViewStore(context, { hasCheckedItems: false })
    this.trigger(context)
  }
  getCheckedDocuments(context) {
    var store = getStore(context)
    var returnValue = []
    _.map(store.items, function(item) {
      var staging
      if (item.document) {
        staging = store.staging[item.document.id] || {}
      } else {
        staging = {}
      }
      var newItem = utils.extend(true, {}, item)
      newItem = utils.extend(true, newItem, staging)
      if (newItem.isChecked) {
        returnValue.push(newItem.document)
      }
    })
    // adiciona os docuemntos novos na lista dado que eles são existem no staging
    var newCheckedItems = _.where(store.staging, {
      status: Status.NEW,
      isChecked: true,
    })
    _.each(newCheckedItems, function(item) {
      returnValue.push(item.document)
    })
    return returnValue
  }

  getDocuments(context) {
    var store = getStore(context)
    var linkFields = getLinkFields(context)
    var returnValue = []
    const items = store.items
    const newItems = _.where(store.staging, { status: Status.NEW })
    const allItems = _.union(items, newItems)

    items.push()
    _.each(allItems, (item) => {
      var staging
      if (item.document) {
        staging = store.staging[item.document.id] || {}
      } else {
        staging = {}
      }
      var newItem = utils.extend(true, {}, item)
      newItem = utils.extend(true, newItem, staging)
      validateLinkedFieldsValue(linkFields, newItem)

      if (store.filter.filteredStatus.length > 0) {
        if ((_.contains(store.filter.filteredStatus, Status.SELECTED) && !newItem.isChecked) ||
          (_.contains(store.filter.filteredStatus, Status.INVALID) && (newItem.isValid === undefined || newItem.isValid)) ||
          (_.contains(store.filter.filteredStatus, Status.STAGING) && newItem.status !== Status.STAGING && newItem.status !== Status.NEW && newItem.status !== Status.DELETED)
        ) {
          return
        }
      }

      newItem.virtualID = returnValue.length
      returnValue.push(newItem)
    })
    return returnValue
  }

  getStagingDocuments(context) {
    var store = getStore(context)
    const requiredFields = this.getRequiredFields(context)
    const documents = []
    _.mapObject(store.staging, (item, key) => {
      const newDocument = utils.extend(true, {}, item.document)
      newDocument.id = key
      const loadedDocument = this.getDocumentById(context, key).document
      _.map(requiredFields, (field) => {
        newDocument[field] = loadedDocument[field]
      })

      documents.push(newDocument)
    })

    return documents
  }

  getDocumentById(context, id) {
    var store = getStore(context)
    var item = _.find(store.items, function(item) {
      return item.document && item.document.id === id
    })
    var staging = store.staging[id] || {}
    if (item || (staging && staging.status === Status.NEW)) {
      const newItem = utils.extend(true, {}, item, staging)
      return newItem
    }
    return null
  }

  findLinkedValue(context, fieldName, value) {
    var store = getStore(context)
    var item = _.find(store.items, function(item) {
      return item.document && item.document[fieldName] === value
    })
    if (item) {
      return item.document[fieldName + '_linked']
    }

    item = _.find(store.staging, function(item) {
      return item.document && item.document[fieldName] === value
    })
    if (item) {
      return item.document[fieldName + '_linked']
    }
    return null
  }

  getFilterStore(context) {
    return getStore(context).filter
  }
  /* Filter methods */
  setIsStagingFilter(context, value) {
    var store = getStore(context)
    if (value) {
      store.filter.filteredStatus = [
        Status.STAGING,
        Status.DELETED,
        Status.NEW,
      ]
    } else {
      store.filter.filteredStatus = []
    }
    this.trigger(context)
  }
  setIsCheckedFilter(context, value) {
    var store = getStore(context)
    if (value) {
      store.filter.filteredStatus = [Status.SELECTED]
    } else {
      store.filter.filteredStatus = []
    }
    this.trigger(context)
  }

  setIsInvalidFilter(context, value) {
    var store = getStore(context)
    if (value) {
      store.filter.filteredStatus = [Status.INVALID]
    } else {
      store.filter.filteredStatus = []
    }
    this.trigger(context)
  }
  getViewStore(context) {
    // calcular os filtros habilitados aqui, vai servir para definir
    // tentar matar matar o método SetViewStore
    if (!context.entityId) {
      return
    }
    var store = getStore(context)
    var documents = this.getDocuments(context)
    var filter = {}
    filter.isStagingFilterActive = _.contains(
      store.filter.filteredStatus,
      Status.DELETED,
      Status.NEW,
      Status.STAGING
    )
    filter.isSelectedFilterActive = _.contains(
      store.filter.filteredStatus,
      Status.SELECTED
    )

    filter.isInvalidFilterActive = _.contains(
       store.filter.filteredStatus,
       Status.INVALID
    )

    return _.extend(store.view, {
      documents: documents,
      filter: filter,
      fileSystemRefs: store.fileSystemRefs,
      sort: store.sort,
      where: store.where,
      errorMessage: store.errorMessage,
    })
  }
  onOpenDocumentInForm(documentId, context, callback) {
    _formStore.context = context
    _formStore.documentId = documentId
    _formStore.callback = callback
    _formStore.historical.push({
      context: context,
      document: documentId,
      callback: callback,
    })
    this.trigger()
  }
  getFormStore() {
    var item = _formStore.context
      ? this.getDocumentById(_formStore.context, _formStore.documentId)
      : null
    var response = {
      context: _formStore.context,
      document: item,
      callback: _formStore.callback,
    }
    return response
  }
  getPreviousState() {
    // Tira da lista o item atual
    _formStore.historical.pop()
    if (_formStore.historical.length > 0) {
      var previousItem =
        _formStore.historical[_formStore.historical.length - 1]
      // Configura o item atual o ultimo documento do historico
      _formStore.context = previousItem.context
      _formStore.documentId = previousItem.document
      _formStore.callback = previousItem.callback
      _formStore.historical.pop()
      return this.getFormStore()
    }
    _formStore.context = null
    _formStore.documentId = null
    _formStore.historical = []
    return null
  }
}

export default VTableStore
