const connection = require('../config/database.js');

async function showWishlistByIdPembeli(id_pembeli) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT tbl_wishlist.id_wishlist,
      tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.deskripsi_produk,
      tbl_katalog.stok_produk,
      tbl_katalog.harga_produk,
      tbl_katalog.status_produk,
      tbl_katalog.foto_produk,
      tbl_katalog.created_at,
      tbl_katalog.deleted_at,
      tbl_toko.nama_toko,
      tbl_toko.alamat_toko,
      tbl_toko.id_toko
      FROM tbl_wishlist
      INNER JOIN tbl_katalog ON tbl_wishlist.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      AND tbl_wishlist.id_pembeli = '${id_pembeli}'`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function showWishlistByIdProdukAndIdPembeli(kode_produk, id_pembeli) {
  return new Promise((resolve, reject) => {
    connection.query(
      ` SELECT *
        FROM tbl_wishlist
        WHERE id_pembeli = '${id_pembeli}' AND kode_produk = '${kode_produk}';`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function insertWishlist(formData) {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tbl_wishlist SET ?',
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

async function deleteWishlist(id_wishlist) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM tbl_wishlist WHERE id_wishlist = '${id_wishlist}'`,
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
  showWishlistByIdPembeli,
  showWishlistByIdProdukAndIdPembeli,
  insertWishlist,
  deleteWishlist,
};
