const connection = require('../config/database.js');

async function showKeranjangByIdPembeli(id_pembeli) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
          tbl_keranjang.id_keranjang,
          tbl_keranjang.jumlah_pesanan,
          tbl_keranjang.total_harga,
          tbl_keranjang.catatan,
          tbl_keranjang.status_keranjang,
          tbl_keranjang.keterangan_keranjang,
          tbl_keranjang.id_komen,
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
        IINER JOIN tbl_komen on tbl_keranjang.id_komen = tbl_komen.id_komen
        INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
        INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
        WHERE tbl_keranjang.deleted_at IS NULL
          AND tbl_katalog.deleted_at IS NULL
          AND tbl_keranjang.id_pembeli = '${id_pembeli}'
          AND tbl_keranjang.id_order IS NULL
          AND tbl_katalog.stok_produk > tbl_keranjang.jumlah_pesanan;`, // Ensure stock is greater than order quantity
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
	  tbl_keranjang.status_keranjang,
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
	  WHERE tbl_keranjang.deleted_at IS NULL
      AND tbl_katalog.deleted_at IS NULL
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

async function findKeranjangByIdAndIdToko(id, id_toko) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT
        tbl_keranjang.id_keranjang,
        tbl_keranjang.jumlah_pesanan,
        tbl_keranjang.total_harga,
        tbl_keranjang.status_keranjang AS status,
        tbl_keranjang.keterangan_keranjang AS keterangan,
        tbl_keranjang.catatan,
        tbl_katalog.kode_produk,
        tbl_katalog.nama_produk,
        tbl_katalog.deskripsi_produk,
        tbl_katalog.stok_produk,
        tbl_katalog.harga_produk,
        tbl_katalog.status_produk,
        tbl_katalog.foto_produk,
        tbl_toko.nama_toko,
        tbl_toko.id_toko,
        tbl_order.kode_pesanan,
        tbl_order.jenis_pembayaran,
        tbl_order.created_at,
        tbl_pembeli.username,
        tbl_pembeli.email
      FROM
        tbl_keranjang
      INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
      INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
      INNER JOIN tbl_order ON tbl_keranjang.id_order = tbl_order.id_order
      LEFT JOIN tbl_pembeli ON tbl_order.id_pembeli = tbl_pembeli.id_pembeli
      WHERE
        tbl_keranjang.deleted_at IS NULL
        AND tbl_keranjang.id_keranjang = '${id}' 
        AND tbl_toko.id_toko = '${id_toko}';`,
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
      `UPDATE tbl_keranjang SET deleted_at = NOW() WHERE id_keranjang = '${id_keranjang}'`,
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
          tbl_keranjang.status_keranjang,
          tbl_keranjang.keterangan_keranjang,
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
      WHERE tbl_keranjang.deleted_at IS NULL AND tbl_keranjang.id_keranjang = '${id_keranjang}'`,
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
      `UPDATE tbl_keranjang SET id_order = '${id_order}' WHERE id_keranjang = '${id_keranjang}' AND deleted_at IS NULL`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateStatusAndKeteranganKeranjang(
  id_keranjang,
  status,
  keterangan,
) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_keranjang SET status_keranjang = '${status}', keterangan_keranjang = '${keterangan}' WHERE id_keranjang = '${id_keranjang}' AND deleted_at IS NULL`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      },
    );
  });
}

async function updateIdKomenKeranjang(id_keranjang, id_komen) {
  console.log(
    `UPDATE tbl_keranjang SET id_komen = '${id_komen}' WHERE id_keranjang = ${id_keranjang}`,
  );
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE tbl_keranjang SET id_komen = ${id_komen} WHERE id_keranjang = ${id_keranjang}`,
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
    const sql = `SELECT
          tbl_keranjang.id_keranjang,
          tbl_keranjang.jumlah_pesanan,
          tbl_keranjang.total_harga,
          tbl_keranjang.catatan,
          tbl_keranjang.status_keranjang,
          tbl_keranjang.keterangan_keranjang,
          tbl_katalog.kode_produk,
          tbl_katalog.nama_produk,
          tbl_katalog.deskripsi_produk,
          tbl_katalog.stok_produk,
          tbl_katalog.harga_produk,
          tbl_katalog.status_produk,
          tbl_katalog.foto_produk,
          tbl_toko.nama_toko,
          tbl_toko.id_toko
        FROM tbl_order
        INNER JOIN tbl_keranjang ON tbl_keranjang.id_order = tbl_order.id_order
        INNER JOIN tbl_katalog ON tbl_keranjang.kode_produk = tbl_katalog.kode_produk
        INNER JOIN tbl_toko ON tbl_katalog.id_toko = tbl_toko.id_toko
        WHERE tbl_order.kode_pesanan= '${id_order}' AND tbl_keranjang.deleted_at IS NULL AND tbl_katalog.deleted_at IS NULL`;
    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

module.exports = {
  getKeranjangByOrderId,
  showKeranjangByIdPembeli,
  showKeranjangByIdToko,
  insertKeranjang,
  updateIdOrderKeranjangById,
  updateStatusAndKeteranganKeranjang,
  deleteKeranjang,
  findKeranjangById,
  updateIdKomenKeranjang,
  findKeranjangByIdAndIdToko,
};
