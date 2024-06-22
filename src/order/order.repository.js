const connection = require('../config/database.js');

async function showOrders(kode_pesanan) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
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
      },
    );
  });
}
async function findOrderByOrderCode(orderCode) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_order.kode_pesanan = '${orderCode}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByUserId(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_toko.nama_toko,
      tbl_toko.id_toko,
      tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_order.id_pembeli = '${userId}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByStoreId(storeId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_toko.nama_toko,
      tbl_toko.id_toko,
      tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_toko.id_toko = '${storeId}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByCodeAndStoreId(kode_pesanan, storeId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_toko.nama_toko,
      tbl_toko.id_toko,
      tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_order.kode_pesanan = '${kode_pesanan}' AND tbl_toko.id_toko = '${storeId}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByUserIdAndStatus(userId, status) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.created_at,
      tbl_order.snap_token,
      tbl_toko.nama_toko,
      tbl_toko.id_toko,
      tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_pembeli.id_pembeli,
      tbl_pembeli.email,
      tbl_pembeli.username
      FROM tbl_order
      INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_order.id_pembeli = '${userId}' ${
        status === 'Semuanya' ? '' : ` AND tbl_order.status = '${status}'`
      }`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertOrder(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_order SET ?',
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

async function updateOrderStatusAndPayment(id_order, status, payment_type) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_order SET status = '${status}', jenis_pembayaran = '${payment_type}' WHERE kode_pesanan = '${id_order}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function updateOrderStatusAndKeterangan(id_order, status, keterangan) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_order SET status = '${status}', keterangan = '${keterangan}' WHERE kode_pesanan = '${id_order}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
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

async function findOrderById(id_order) {
  return new Promise((resolve, reject) => {
    connection.query(`Select * from tbl_order WHERE id_order = '${id_order}'`, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    });
  })
}

module.exports = {
  showOrders,
  updateOrderStatusAndKeterangan,
  showOrdersByUserId,
  showOrdersByStoreId,
  insertOrder,
  updateOrderStatusAndPayment,
  showOrdersByUserIdAndStatus,
  findOrderByOrderCode,
  showOrdersByCodeAndStoreId,
};
