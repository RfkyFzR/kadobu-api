const connection = require('../config/database.js');

async function showKeranjangByIdPembeli(id_pembeli) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
          tbl_keranjang.id_keranjang,
          tbl_keranjang.jumlah_pesanan,
          tbl_keranjang.total_harga,
          tbl_keranjang.catatan,
          tbl_katalog.kode_produk,
          tbl_katalog.nama_produk,
          tbl_katalog.deskripsi_produk,
          tbl_katalog.stok_produk,
          tbl_katalog.harga_produk,
          tbl_katalog.status_produk,
          tbl_katalog.foto_produk,
          tbl_toko.nama_toko,
          tbl_toko.id_toko
        FROM tbl_keranjang
        INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
        INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
        WHERE tbl_katalog.deleted_at IS NULL
          AND tbl_keranjang.id_pembeli = '${id_pembeli}'
          AND tbl_keranjang.id_order IS NULL;`, // Filter jika id_order NULL
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function showKeranjangByIdToko(id_toko) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
	  tbl_keranjang.id_keranjang,
	  tbl_keranjang.jumlah_pesanan,
	  tbl_keranjang.total_harga,
tbl_keranjang.catatan,
	  tbl_katalog.kode_produk,
    tbl_katalog.nama_produk,
    tbl_katalog.deskripsi_produk,
    tbl_katalog.stok_produk,
    tbl_katalog.harga_produk,
    tbl_katalog.status_produk,
    tbl_katalog.foto_produk,
    tbl_toko.nama_toko,
    tbl_toko.id_toko
	  FROM tbl_keranjang
    INNER JOIN tbl_order ON tbl_keranjang.id_order = tbl_order.id_order
    INNER JOIN tbl_katalog ON tbl_order.kode_produk = tbl_katalog.kode_produk
    INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
	  WHERE tbl_katalog.deleted_at IS NULL
	  AND tbl_katalog.id_toko = ${id_toko}`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertKeranjang(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_keranjang SET ?',
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

async function deleteKeranjang(id_keranjang) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM tbl_keranjang WHERE id_keranjang = '${id_keranjang}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function findKeranjangById(id_keranjang) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
          tbl_keranjang.id_keranjang,
          tbl_keranjang.jumlah_pesanan,
          tbl_keranjang.total_harga,
          tbl_keranjang.catatan,
          tbl_katalog.kode_produk,
    tbl_katalog.nama_produk,
    tbl_katalog.deskripsi_produk,
    tbl_katalog.stok_produk,
    tbl_katalog.harga_produk,
    tbl_katalog.status_produk,
    tbl_katalog.foto_produk,
    tbl_toko.nama_toko,
    tbl_toko.id_toko
          FROM tbl_keranjang
    INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
    INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
          WHERE tbl_keranjang.id_keranjang = '${id_keranjang}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateIdOrderKeranjangById(id_keranjang, id_order) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_keranjang SET id_order = '${id_order}' WHERE id_keranjang = '${id_keranjang}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function getKeranjangByOrderId(id_order) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
          tbl_keranjang.id_keranjang,
          tbl_keranjang.jumlah_pesanan,
          tbl_keranjang.total_harga,
          tbl_keranjang.catatan,
          tbl_katalog.kode_produk,
          tbl_katalog.nama_produk,
          tbl_katalog.deskripsi_produk,
          tbl_katalog.stok_produk,
          tbl_katalog.harga_produk,
          tbl_katalog.status_produk,
          tbl_katalog.foto_produk,
          tbl_toko.nama_toko,
          tbl_toko.id_toko
        FROM tbl_keranjang
        INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
        INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
	  WHERE tbl_keranjang.id_order = ${id_order}`,
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
  getKeranjangByOrderId,
  showKeranjangByIdPembeli,
  showKeranjangByIdToko,
  insertKeranjang,
  updateIdOrderKeranjangById,

  deleteKeranjang,
  findKeranjangById,
};
