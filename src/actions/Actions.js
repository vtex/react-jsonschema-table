import Reflux from 'reflux'
import _ from 'underscore'
// import API from './api/Gateway'
import Status from '../stores/Status'
import json2csv from 'json2csv'
import PromisePool from 'es6-promise-pool'

var Actions = Reflux.createActions({
  configurationLoad: { asyncResult: true },
  documentLoadPage: { asyncResult: true },
  deleteDocument: { asyncResult: true },
  loadDocumentLink: { asyncResult: true },
  documentStaging: {},
  markDocumentToRemove: {},
  documentCheck: {},
  documentCancelStaging: {},
  openDocumentInForm: {},
  checkedFilter: {},
  stagingFilter: {},
  invalidFilter: {},
  loadingDocuments: {},
  documentSaveAll: { asyncResult: true },
  addDocument: {},
  clearErrorMessages: {},
  importDocument: {},
  addDocumentAndOpen: {},
  loadEntityPage: {},
  addAttachment: { asyncResult: true },
  addAttachmentRef: { asyncResult: true },
  deleteAttachmentRef: { asyncResult: true },
  cancelImport: {},
  deleteCheckedRows: {},
  changeColumnVisibility: {},
  showAllColumns: {},
  changeRowStatus: {},
  exportCheckedItems: { asyncResult: true },
  sesChange: {},
  pasteData: {},
  copyFromSelectedRange: {},
  undo: {},
  redo: {},
})

Actions.configurationLoad.listen(function() {
  // var that = this
  // API.configurationLoad().then(function(response) {
  //   that.completed(response)
  // })
})

Actions.documentLoadPage.listen(function(
  context,
  model,
  fields,
  skip,
  size,
  where,
  sort
) {
  // var that = this
  // API.documentLoadPage(context.entityId, model, fields, skip, size, where, sort)
  //   .then(function(response) {
  //     var contentRange = response.headers['rest-content-range'].split(' ')[1]
  //     var rowStart = contentRange.split('/')[0].split('-')[0]
  //     // var rowEnd = contentRange.split('/')[0].split('-')[1]
  //     var totalRows = contentRange.split('/')[1]
  //     that.completed(
  //       context,
  //       response.data,
  //       parseInt(rowStart),
  //       parseInt(totalRows),
  //       where,
  //       sort
  //     )
  //   })
  //   .catch(function(error) {
  //     that.completed(
  //       context,
  //       error.response.data.Message
  //         ? error.response.data.Message
  //         : error.response.data
  //     )
  //   })
})

Actions.deleteDocument.listen(function(entityName, key) {
  var that = this
  // API.deleteDocument(entityName, key).then(function(entityName, key, result) {
  //   that.completed(entityName, key, result)
  // })
})

Actions.loadDocumentLink.listen(function(id, context, model, fields) {
  var that = this
  // API.loadDocument(context.entityId, id, model, fields).then(function(
  //   response
  // ) {
  //   that.completed(context, id, response.data)
  // })
})

Actions.documentSaveAll.listen(function(context, model, documents) {
  var that = this
  // var documentsToSave = _.filter(state.documents, function(item) {
  //   return (
  //     item.status === Status.STAGING ||
  //     item.status === Status.NEW ||
  //     item.status === Status.IMPORTED ||
  //     item.status === Status.DELETED
  //   )
  // })

  // var promises = []
  const generatePromises = function * () {
    for (let index = 0; index < documents.length; index++) {
      const item = documents[index]
      var id = item.id
      var document = item
      // var document = _.pick(item.document, function(attr) {
      // return attr !== null
      // })
      // Tirar o _self do documento, ele não é necessario para dar save
      delete document._self
      // Se o documento for um link tirar o field que é carregado por fetch para que não seja associado com o documento
      // if (item.status === Status.DELETED) {
      // yield API.deleteDocument(context.entityId, model, id)
      // continue
      // }
      // yield API.saveDocument(document, context.entityId, model, id)

      // _.each(state.fileSystemRefs.toAdd, function(urlArray, key) {
      //   _.each(urlArray, function(url) {
      //     promises.push(API.addAttachmentRef(url, key))
      //   })
      // })
      // _.each(state.fileSystemRefs.toDelete, function(urlArray, key) {
      //   _.each(urlArray, function(url) {
      //     promises.push(API.deleteAttachmentRef(url, key))
      //   })
      // })
    }
  }
  // _.map(documentsToSave, function(item) {
  //   // TODO: Estou removendo os atributos com null porque o Schema não aceita esses atributos, a não ser que o type seja definido com ['string', 'null']
  //   var id = item.document.id
  //   var document = _.pick(item.document, function(attr) {
  //     return attr !== null
  //   })
  //   // Tirar o _self do documento, ele não é necessario para dar save
  //   delete document._self
  //   // Se o documento for um link tirar o field que é carregado por fetch para que não seja associado com o documento
  //   if (item.status === Status.DELETED) {
  //     promises.push(API.deleteDocument(context.entityId, model, id))
  //   } else {
  //     promises.push(API.saveDocument(document, context.entityId, model, id))
  //   }
  //   _.each(state.fileSystemRefs.toAdd, function(urlArray, key) {
  //     _.each(urlArray, function(url) {
  //       promises.push(API.addAttachmentRef(url, key))
  //     })
  //   })
  //   _.each(state.fileSystemRefs.toDelete, function(urlArray, key) {
  //     _.each(urlArray, function(url) {
  //       promises.push(API.deleteAttachmentRef(url, key))
  //     })
  //   })
  // })

  // Promise.all(promises)
  //   .then(() => {
  //     that.completed(context)
  //   })
  //   .catch(function(response) {
  //     that.completed(
  //       context,
  //       response.response.data.errors[0].errors[0].Message
  //     )
  //   })

  // The number of promises to process simultaneously.
  var concurrency = 1

  const promiseIterator = generatePromises()

  // Create a pool.
  var pool = new PromisePool(promiseIterator, concurrency)

  // Start the pool.
  var poolPromise = pool.start()

  // Wait for the pool to settle.
  poolPromise.then(
    function() {
      that.completed(context)
    },
    function(response) {
      that.completed(context, response.message)
    }
  )
})

Actions.addAttachment.listen(function(attachments, cell) {
  var that = this
  var promises = []
  // _.each(attachments, function(attachment) {
  //   promises.push(API.addAttachment(attachment.fileName, attachment.file))
  // })
  Promise.all(promises)
    .then(results => {
      var addedFiles = []
      _.each(results, function(result) {
        // validate o status do request
        addedFiles.push(result.config.url)
      })
      that.completed(addedFiles, cell)
    })
    .catch(function(response) {
      console.log(response)
    })
})

Actions.addAttachmentRef.listen(function() {})

Actions.deleteAttachmentRef.listen(function() {})

Actions.exportCheckedItems.listen(function(context, fields, documents) {
  var that = this
  json2csv({ data: documents, fields: fields }, function(err, csv) {
    if (err) console.log(err)
    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    var csvURL = window.URL.createObjectURL(csvData)
    var tempLink = document.createElement('a')
    tempLink.href = csvURL
    tempLink.setAttribute('download', `${context.entityId}-${Date.now()}.csv`)
    tempLink.click()
    that.completed(context, documents)
  })
})

export default Actions
