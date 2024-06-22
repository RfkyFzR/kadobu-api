const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getStatisticsInYear } = require('./statistik.service.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:idToko', apiKeyMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  const year = req.query.tahun;
  let id_toko = req.params.idToko;

  try {
    const result = await getStatisticsInYear(id_toko, year);
    const { total_produk, statistics } = result;

    // Ekstrak jumlah_pesanan dan total_penjualan ke dalam array terpisah
    const total_pesanan = statistics.map((stat) => stat.jumlah_pesanan);
    const total_penjualan = statistics.map((stat) => stat.total_penjualan);

    // Kembalikan objek baru dengan struktur yang diinginkan
    const data = {
      total_produk,
      total_pesanan,
      total_penjualan,
    };
    return res.status(200).json({
      status: true,
      message: 'Success: Get Statistics Data',
      result: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Fail: Get Statistics Data',
      error: error.message,
    });
  }
});

module.exports = router;
