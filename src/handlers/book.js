const { nanoid } = require('nanoid');
const { validateGenericBook } = require('../helpers/helpers');
const ValidationError = require('../helpers/ValidationError');
const books = require('../store/books');

const addBook = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher,
      pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    validateGenericBook(newBook, 'menambahkan');
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    throw new Error('Buku gagal ditambahkan');
  } catch (error) {
    if (error instanceof ValidationError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getAllBooks = (request, h) => {
  let newBooks = [];
  const { name, reading, finished } = request.query;
  if (books.length > 0) {
    if (name !== undefined) {
      newBooks = books.filter((book) => (book.name.toLowerCase().includes(name.toLowerCase())));
    } else if (reading !== undefined) {
      if (reading === '1') {
        newBooks = books.filter((book) => (book.reading === true));
      } else {
        newBooks = books.filter((book) => (book.reading === false));
      }
    } else if (finished !== undefined) {
      if (finished === '1') {
        newBooks = books.filter((book) => (book.finished === true));
      } else {
        newBooks = books.filter((book) => (book.finished === false));
      }
    } else {
      newBooks = books;
    }
  }
  const response = h.response({
    status: 'success',
    data: {
      books: newBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  try {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
    if (book === undefined) throw new Error('Buku tidak ditemukan');
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const editBookById = (request, h) => {
  try {
    const { bookId } = request.params;
    const {
      name, year, author, summary, publisher,
      pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) { throw new Error('Gagal memperbarui Buku. Id tidak ditemukan'); }
    const data = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      finished,
      readPage,
      reading,
      updatedAt,
    };
    validateGenericBook(data, 'memperbarui');
    books[index] = data;
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } catch (error) {
    if (error instanceof ValidationError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
