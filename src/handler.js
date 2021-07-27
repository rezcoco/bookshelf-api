const { nanoid } = require('nanoid')
const books = require('./books')

const addToHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toDateString()
  const updatedAt = insertedAt
  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }
  const getStatusNdMsg = (status, message) => ({ status, message })

  const isSameName = books.filter((book) => book.name === name).length > 0

  if (name === undefined) {
    const response = h.response(getStatusNdMsg('fail', 'Gagal menambahkan buku. Mohon isi nama buku'))
    response.code(400)

    return response
  } else if (readPage > pageCount) {
    const response = h.response(getStatusNdMsg('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'))
    response.code(400)

    return response
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (!isSuccess) {
    const response = h.response(getStatusNdMsg('error', 'Buku gagal ditambahkan'))
    response.code(500)

    return response
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id }
  })
  response.code(201)

  return response
}

const getAllBooksHandler = (request, h) => {
  let { name, reading, finished } = request.query
  const getStatusNdMsg = (status, message) => ({ status, message })
  const getDetails = (variable) => ({
    status: 'success',
    data: {
      books: variable.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })

  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: { books }
    })
    response.code(200)

    return response
  }

  if (name !== undefined) {
    name = name.toLowerCase()
    const bookName = books.filter((book) => book.name.toLowerCase().includes(name))

    if (bookName.length > 0) {
      const response = h.response(getDetails(bookName))
      response.code(200)

      return response
    }

    const response = h.response(getStatusNdMsg('fail', 'Gagal mendapatkan buku, nama tidak ditemukan'))
    response.code(404)

    return response
  }

  if (reading !== undefined) {
    reading = reading === '1'
    const bookReading = books.filter((book) => book.reading === reading)

    if (bookReading.length > 0) {
      const response = h.response(getDetails(bookReading))
      response.code(200)

      return response
    }

    const response = h.response(getStatusNdMsg('fail', `${reading === '1' ? 'Semua buku sedang dibaca' : 'Tidak ada buku yang sedang dibaca'}`))
    response.code(404)

    return response
  }

  if (finished !== undefined) {
    finished = finished === '1'
    const bookFinished = books.filter((book) => book.finished === finished)

    if (bookFinished.length > 0) {
      const response = h.response(getDetails(bookFinished))
      response.code(200)

      return response
    }

    const response = h.response(getStatusNdMsg('fail', `${finished === '1' ? 'Semua buku telah selesai' : 'Semua buku belum selesai'}`))
    response.code(404)

    return response
  }

  // return all books if without query
  const response = h.response(getDetails(books))
  response.code(200)

  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((book) => book.id === bookId)[0]

  console.log(book)

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: { book }
    })
    response.code(200)

    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)

  return response
}

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const index = books.findIndex((book) => book.id === bookId)

  const getStatusNdMsg = (status, message) => ({ status, message })

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response(getStatusNdMsg('fail', 'Gagal memperbarui buku. Mohon isi nama buku'))
      response.code(400)

      return response
    } else if (readPage > pageCount) {
      const response = h.response(getStatusNdMsg('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'))
      response.code(400)

      return response
    }

    books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading }

    const response = h.response(getStatusNdMsg('success', 'Buku berhasil diperbarui'))
    response.code(200)

    return response
  }

  const response = h.response(getStatusNdMsg('fail', 'Gagal memperbarui buku. Id tidak ditemukan'))
  response.code(404)

  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)

    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)

  return response
}

module.exports = { addToHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler }
