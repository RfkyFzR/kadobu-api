const connection = require("../config/database.js");

async function showOrders(kode_pesanan) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_katalog.nama_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      AND tbl_order.kode_pesanan LIKE '%%${kode_pesanan}%%'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
}

async function insertOrder(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO tbl_order SET ?",
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

async function updateOrderStatus(id_order, status) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE tbl_order SET status = '${status}' WHERE id_order = '${id_order}'`, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

module.exports = {
  showOrders,
  insertOrder,
  updateOrderStatus
};
