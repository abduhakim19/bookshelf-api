const ValidationError = require('./ValidationError');

const validateGenericBook = (data, teks) => {
  const { name, pageCount, readPage } = data;
  if (readPage > pageCount) {
    throw new ValidationError(`Gagal ${teks} buku. readPage tidak boleh lebih besar dari pageCount`);
  }
  if (name === undefined) {
    throw new ValidationError(`Gagal ${teks} buku. Mohon isi nama buku`);
  }
};

module.exports = { validateGenericBook };
