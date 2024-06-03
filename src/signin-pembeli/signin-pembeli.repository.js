const connection = require("../config/database.js");

async function findPembeliByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM tbl_pembeli WHERE email = '${email}'`, (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

module.exports = {
    findPembeliByEmail,
}