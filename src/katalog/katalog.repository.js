const connection = require('../config/database.js');

async function showKatalogs(nama_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_katalog.kode_produk,
              tbl_katalog.nama_produk,
              tbl_katalog.deskripsi_produk,
              tbl_katalog.stok_produk,
              tbl_katalog.harga_produk,
              tbl_katalog.status_produk,
              tbl_katalog.foto_produk,
              tbl_katalog.created_at,
              tbl_toko.nama_toko,
              tbl_toko.alamat_toko,
              tbl_toko.id_toko
       FROM tbl_katalog
       INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
       WHERE tbl_katalog.deleted_at IS NULL
       AND tbl_katalog.stok_produk > 0
       AND tbl_katalog.nama_produk LIKE ?`,
      [`%${nama_produk}%`],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertKatalog(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_katalog SET ?',
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

async function updateKatalog(formData, id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_katalog SET ? WHERE kode_produk = '${id}'`,
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

async function deleteKatalog(deleted_date, kode_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_katalog SET deleted_at = '${deleted_date}' WHERE kode_produk = '${kode_produk}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function findKatalogByProductCode(kode_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_katalog.kode_produk,
    tbl_katalog.nama_produk,
    tbl_katalog.deskripsi_produk,
    tbl_katalog.stok_produk,
    tbl_katalog.harga_produk,
    tbl_katalog.status_produk,
    tbl_katalog.foto_produk,
    tbl_katalog.created_at,
    tbl_toko.nama_toko,
tbl_toko.alamat_toko,
    tbl_toko.alamat_toko,
    tbl_toko.foto_profil,
    tbl_toko.id_toko
    FROM tbl_katalog
    INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
    WHERE tbl_katalog.deleted_at IS NULL AND tbl_katalog.kode_produk = '${kode_produk}' AND deleted_at IS NULL`,
      (error, results, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}
async function findKatalogByStoreId(store_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_katalog.kode_produk,
    tbl_katalog.nama_produk,
    tbl_katalog.deskripsi_produk,
    tbl_katalog.stok_produk,
    tbl_katalog.harga_produk,
    tbl_katalog.status_produk,
    tbl_katalog.foto_produk,
    tbl_katalog.created_at,
    tbl_toko.nama_toko,
tbl_toko.alamat_toko,
    tbl_toko.id_toko
    FROM tbl_katalog
    INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
    WHERE tbl_katalog.deleted_at IS NULL AND tbl_toko.id_toko = '${store_id}' AND deleted_at IS NULL`,
      (error, results, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateStockProduk(stok_produk, kode_produk) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_katalog SET stok_produk = '${stok_produk}' WHERE kode_produk = '${kode_produk}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function countsKatalogsReady(id_toko) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT SUM(stok_produk) AS total_produk
FROM tbl_katalog
WHERE deleted_at IS NULL
AND status_produk = 'Ready'
    AND id_toko = '${id_toko}';
    `,
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
  countsKatalogsReady,
  showKatalogs,
  insertKatalog,
  updateKatalog,
  deleteKatalog,
  findKatalogByProductCode,
  updateStockProduk,
  findKatalogByStoreId,
};
