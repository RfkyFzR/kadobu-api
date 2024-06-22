const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getStatisticsInYear,
} = require('./statistik.service.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:idToko', apiKeyMiddleware, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    const year = req.query.tahun
    let id_toko = req.params.idToko;

    const result = await getStatisticsInYear(id_toko, year);
    return res.status(200).json({
      status: true,
      message: 'Success: Get Statistics Data',
      result,
    });
  });

module.exports = router;