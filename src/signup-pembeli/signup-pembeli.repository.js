const connection = require("../config/database.js");

async function insertPembeli(formData) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO tbl_pembeli SET ?', formData, (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

module.exports = {
    insertPembeli,
}