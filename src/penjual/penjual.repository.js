const connection = require("../config/database.js");

async function showPenjual() {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM tbl_penjual ORDER BY id desc",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}

async function insertPenjual(formData) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO tbl_penjual SET ?', formData, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

module.exports = {
    showPenjual,
    insertPenjual,
}