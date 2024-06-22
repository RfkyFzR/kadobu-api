const connection = require('../config/database.js');

async function showPembeli() {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM tbl_pembeli ORDER BY id desc',
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
function showPembeliById(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM tbl_pembeli ORDER BY id desc WHERE id_pembeli = ${id}`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertPembeli(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_pembeli SET ?',
      formData,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function findPembeliByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM tbl_pembeli WHERE email = '${email}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function findPembeliById(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM tbl_pembeli WHERE id_pembeli = '${id}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateToken(token, id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_pembeli SET token = '${token}' WHERE ID = '${id}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

module.exports = {
  showPembeli,
  insertPembeli,
  findPembeliByEmail,
  updateToken,
  findPembeliById,
};
