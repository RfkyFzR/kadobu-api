const connection = require("../config/database.js");

async function showKatalogs() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT tbl_katalog.kode_produk,
    tbl_katalog.nama_produk,
    tbl_katalog.deskripsi_produk,
    tbl_katalog.stok_produk,
    tbl_katalog.harga_produk,
    tbl_katalog.status_produk,
    tbl_katalog.foto_produk,
    tbl_toko.nama_toko,
    tbl_toko.id_toko
    FROM tbl_katalog
    INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko`, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

async function insertKatalog(formData) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO tbl_katalog SET ?', formData, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

async function updateKatalog(formData, id) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE tbl_katalog SET ? WHERE kode_produk = '${id}'`, formData, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

async function deleteKatalog(id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM tbl_katalog WHERE kode_produk = '${id}'`, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

async function findKatalogs(keyWords) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM tbl_katalog WHERE nama_produk LIKE '%%${keyWords}%%'`, (error, results, data) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}


async function findKatalogById(id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM tbl_katalog WHERE kode_produk = '${id}'`, (error, results, data) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}


module.exports = {
  showKatalogs,
  insertKatalog,
  updateKatalog,
  deleteKatalog,
  findKatalogs,
  findKatalogById
};
