const connection = require("../config/database.js");

async function showPenggunas() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM tbl_pengguna ORDER BY id desc", (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

async function insertPengguna(formData) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO tbl_pengguna SET ?', formData, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

module.exports = {
  showPenggunas,
  insertPengguna,
};
