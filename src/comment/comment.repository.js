const connection = require("../config/database.js");

async function showCommentByKodeProduk(kode_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_pembeli.username,
        tbl_comment.rating,
        tbl_comment.comment
        FROM tbl_comment
        INNER JOIN tbl_keranjang ON tbl_comment.id_keranjang = tbl_keranjang.id_keranjang
        INNER JOIN tbl_pembeli ON tbl_keranjang.id_pembeli = tbl_pembeli.id_pembeli
		INNER JOIN tbl_order ON tbl_keranjang.id_order = tbl_order.id_order
		INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
        WHERE tbl_katalog.deleted_at IS NULL
        AND tbl_katalog.kode_produk = '${kode_produk}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}

async function insertComment(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO tbl_comment SET ?",
      formData,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}

async function deleteComment(id_comment) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM tbl_comment WHERE id_comment = '${id_comment}'`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }

module.exports = {
  showCommentByKodeProduk,
  insertComment,
  deleteComment,
};
