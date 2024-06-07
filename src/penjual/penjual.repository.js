const connection = require('../config/database.js');

async function showPenjual() {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM tbl_penjual ORDER BY id desc',
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showPenjualById(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM tbl_penjual ORDER BY id desc WHERE id_penjual = ${id}`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertPenjual(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_penjual SET ?',
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

async function updateFkPenjual(id_toko, id_penjual) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_penjual SET id_toko = '${id_toko}', role = 'Pemilik' WHERE id_penjual = '${id_penjual}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateRoleKaryawan(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_penjual SET id_toko = '${formData.id_toko}', role = 'Karyawan' WHERE username = '${formData.username}'`,
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
  showPenjual,
  showPenjualById,
  insertPenjual,
  updateFkPenjual,
  updateRoleKaryawan,
};
