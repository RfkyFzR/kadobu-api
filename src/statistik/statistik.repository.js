const connection = require('../config/database.js');

async function showStatisticsInYear(id_toko, year) {
  return new Promise((resolve, reject) => {
    connection.query(
      `WITH months AS (
        SELECT 1 AS bulan UNION ALL
        SELECT 2 AS bulan UNION ALL
        SELECT 3 AS bulan UNION ALL
        SELECT 4 AS bulan UNION ALL
        SELECT 5 AS bulan UNION ALL
        SELECT 6 AS bulan UNION ALL
        SELECT 7 AS bulan UNION ALL
        SELECT 8 AS bulan UNION ALL
        SELECT 9 AS bulan UNION ALL
        SELECT 10 AS bulan UNION ALL
        SELECT 11 AS bulan UNION ALL
        SELECT 12 AS bulan
    )
    SELECT
        ${year} AS tahun, 
        m.bulan,
        COALESCE(SUM(k.jumlah_pesanan), 0) AS jumlah_pesanan,
        COALESCE(SUM(k.total_harga), 0) AS total_penjualan
    FROM
        months m
    LEFT JOIN (
        SELECT
            k.id_keranjang,
            k.jumlah_pesanan,
            k.total_harga,
            k.status_keranjang,
            k.keterangan_keranjang,
            k.catatan,
            k.created_at
        FROM
            tbl_keranjang k
        JOIN
            tbl_katalog g ON k.kode_produk = g.kode_produk
        WHERE
            g.id_toko = '${id_toko}' 
            AND k.deleted_at IS NULL
            AND k.status_keranjang NOT IN ('PENDING', 'CANCELED', 'NOT_PAID')
            AND YEAR(k.created_at) = ${year}
    ) k ON m.bulan = MONTH(k.created_at)
    GROUP BY
        m.bulan
    ORDER BY
        m.bulan;`,
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
  showStatisticsInYear,
};
