const { addToHandler, getAllBooksHandler, getBookById, updateBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addToHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
