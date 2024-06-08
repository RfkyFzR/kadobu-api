const connection = require("../config/database.js");

async function showStatisticsInYear(id_toko, year) {
    return new Promise((resolve, reject) => {
      connection.query(`WITH months AS (
        SELECT 1 AS bulan
        UNION ALL
        SELECT 2 AS bulan
        UNION ALL
        SELECT 3 AS bulan
        UNION ALL
        SELECT 4 AS bulan
        UNION ALL
        SELECT 5 AS bulan
        UNION ALL
        SELECT 6 AS bulan
        UNION ALL
        SELECT 7 AS bulan
        UNION ALL
        SELECT 8 AS bulan
        UNION ALL
        SELECT 9 AS bulan
        UNION ALL
        SELECT 10 AS bulan
        UNION ALL
        SELECT 11 AS bulan
        UNION ALL
        SELECT 12 AS bulan
    )
    SELECT
        '${year}' AS tahun,
        m.bulan,
        COALESCE(SUM(o.total_pesanan), 0) AS jumlah_pesanan,
        COALESCE(SUM(o.total_harga), 0) AS total_penjualan
    FROM
        months m
    LEFT JOIN
        tbl_order o
        ON m.bulan = MONTH(o.created_at) AND YEAR(o.created_at) = '${year}'
        AND o.status NOT IN ('PENDING', 'CANCELED')
    LEFT JOIN
        tbl_katalog k
        ON o.kode_produk = k.kode_produk AND k.id_toko = '${id_toko}'
    GROUP BY
        m.bulan
    ORDER BY
        m.bulan;`, (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

module.exports = {
    showStatisticsInYear,
}