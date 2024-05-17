const connection = require("../config/database.js");

async function showKatalogsByIdStore(id) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT tbl_katalog.kode_produk,
      tbl_katalog.nama_produk,
      tbl_katalog.deskripsi_produk,
      tbl_katalog.stok_produk,
      tbl_katalog.harga_produk,
      tbl_katalog.status_produk,
      tbl_katalog.foto_produk
      FROM tbl_katalog
      WHERE id_toko = '${id}'`, (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

  async function showStoreById(id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT tbl_toko.id_toko,
        tbl_toko.nama_toko,
        tbl_toko.deskripsi_toko,
        tbl_toko.alamat_toko,
        tbl_toko.foto_profil,
        tbl_toko.foto_banner
        FROM tbl_toko
        WHERE id_toko = '${id}'`, (error, results) => {
            if (error){
                return reject (error)
            }
            return resolve (results);
        });
    })
  }

  module.exports = {
    showKatalogsByIdStore,
    showStoreById,
  }