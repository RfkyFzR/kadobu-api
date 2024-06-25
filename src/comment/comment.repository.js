const connection = require('../config/database.js');

async function showCommentByKodeProduk(kode_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_pembeli.username, tbl_pembeli.id_pembeli, 
        tbl_komen.rating,
        tbl_komen.created_at,
        tbl_komen.text
        FROM tbl_komen
        INNER JOIN tbl_keranjang ON tbl_keranjang.id_komen = tbl_komen.id_komen
        INNER JOIN tbl_katalog ON tbl_katalog.kode_produk = tbl_keranjang.kode_produk
        INNER JOIN tbl_pembeli ON tbl_keranjang.id_pembeli = tbl_pembeli.id_pembeli
        WHERE tbl_katalog.kode_produk = '${kode_produk}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function getCommentById(id_comment) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM tbl_komen
        WHERE tbl_komen.id_komen = '${id_comment}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertComment(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_komen SET ?',
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

async function deleteComment(id_komen) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM tbl_komen WHERE id_komen = '${id_komen}'`,
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
  showCommentByKodeProduk,
  insertComment,
  deleteComment,
  getCommentById,
};
