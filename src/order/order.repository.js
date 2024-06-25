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
      tbl_order.catatan,
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
      tbl_order.created_at,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_keranjang.id_keranjang,
      tbl_keranjang.jumlah_pesanan,
      tbl_keranjang.total_harga,
      tbl_keranjang.catatan,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_katalog.kode_produk,
      tbl_toko.id_toko,
      tbl_toko.nama_toko,
      tbl_pembeli.username,
      tbl_pembeli.email
      FROM tbl_order
      INNER JOIN tbl_keranjang ON tbl_order.id_order = tbl_keranjang.id_order
      INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_order.kode_pesanan = '${orderCode}'
      ORDER BY tbl_order.created_at DESC`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByUserId(userId, find) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT *
FROM tbl_order
WHERE tbl_order.id_pembeli = '${userId}' AND tbl_order.status = 'PENDING' AND tbl_order.kode_pesanan LIKE '%%${find}%%'
ORDER BY tbl_order.created_at DESC`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function showOrdersByUserIdAndStatus(userId, status, kodePesanan) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        k.id_keranjang, 
        k.jumlah_pesanan, 
        k.total_harga, 
        k.catatan, 
        k.status_keranjang, 
        k.id_komen, 
        p.kode_produk, 
        p.nama_produk, 
        p.deskripsi_produk, 
        p.stok_produk, 
        p.harga_produk, 
        p.status_produk, 
        p.foto_produk, 
        t.nama_toko, 
        t.id_toko, 
        o.id_order,
        o.kode_pesanan
      FROM tbl_order o
      JOIN tbl_keranjang k ON o.id_order = k.id_order
      JOIN tbl_katalog p ON k.kode_produk = p.kode_produk
      JOIN tbl_toko t ON p.id_toko = t.id_toko
      WHERE o.kode_pesanan LIKE ?
        AND o.id_pembeli = ?
        AND k.status_keranjang = ?
    `;

    const values = [`%%${kodePesanan}%%`, userId, status];

    connection.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

async function showOrdersByStoreId(storeId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.created_at,
      tbl_order.jenis_pembayaran,
      tbl_keranjang.status_keranjang as status,
      tbl_keranjang.id_keranjang,
      tbl_keranjang.jumlah_pesanan,
      tbl_keranjang.total_harga,
      tbl_keranjang.catatan,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_katalog.kode_produk,
      tbl_toko.id_toko,
      tbl_toko.nama_toko,
      tbl_pembeli.username,
      tbl_pembeli.email
      FROM tbl_order
      INNER JOIN tbl_keranjang ON tbl_order.id_order = tbl_keranjang.id_order
      INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_toko.id_toko = '${storeId}' AND tbl_order.status != "PENDING"
      ORDER BY tbl_order.created_at DESC`,
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
      tbl_order.created_at,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_keranjang.id_keranjang,
      tbl_keranjang.jumlah_pesanan,
      tbl_keranjang.total_harga,
      tbl_keranjang.catatan,
      tbl_katalog.nama_produk,
      tbl_katalog.foto_produk,
      tbl_katalog.kode_produk,
      tbl_toko.id_toko,
      tbl_toko.nama_toko,
      tbl_pembeli.username,
      tbl_pembeli.email
      FROM tbl_order
      INNER JOIN tbl_keranjang ON tbl_order.id_order = tbl_keranjang.id_order
      INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE tbl_toko.id_toko = '${storeId}' AND tbl_order.kode_pesanan = '${kode_pesanan}'
      ORDER BY tbl_order.created_at DESC`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function showOrdersByUserIdAndStatusTemp(userId, status) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_order.id_order,
      tbl_order.kode_pesanan,
      tbl_order.jenis_pembayaran,
      tbl_order.status,
      tbl_order.total_pesanan,
      tbl_order.total_harga,
      tbl_order.keterangan,
      tbl_order.catatan,
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
      } ORDER BY tbl_order.created_at DESC`,
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
    connection.query(
      `UPDATE tbl_order SET status = '${status}' WHERE id_order = '${id_order}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function findOrderById(id_order) {
  return new Promise((resolve, reject) => {
    connection.query(
      `Select * from tbl_order WHERE id_order = '${id_order}'`,
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
  showOrders,
  showOrdersByUserId,
  showOrdersByStoreId,
  showOrdersByUserIdAndStatus,
  showOrdersByCodeAndStoreId,
  findOrderById,
  findOrderByOrderCode,
  insertOrder,
  updateOrderStatusAndKeterangan,
  updateOrderStatusAndPayment,
};
