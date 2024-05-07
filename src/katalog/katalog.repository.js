const connection = require("../config/database.js");

async function showKatalogs() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM tbl_katalog ORDER BY kode_produk desc", (error, results) => {
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


module.exports = {
  showKatalogs,
  insertKatalog,
  updateKatalog,
  deleteKatalog,
  findKatalogs,
};
