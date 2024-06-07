const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getPenjual,
  getPenjualById,
  addPenjual,
} = require('./penjual.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/', apiKeyMiddleware, async (req, res) => {
  const responsePenjual = await getPenjual();
  return res.status(200).json({
    status: true,
    message: 'List Data Penjual',
    data: responsePenjual,
  });
});

router.get('/:id', apiKeyMiddleware, async (req, res) => {
  const id = req.params.id;
  const responsePenjual = await getPenjualById(id);
  return res.status(200).json({
    status: true,
    message: 'List Data Penjual',
    data: responsePenjual,
  });
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.any(),
  [
    body('idPenjual').notEmpty(),
    body('email').notEmpty(),
    body('username').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let formData = {
      id_penjual: req.body.idPenjual,
      email: req.body.email,
      username: req.body.username,
    };
    try {
      await addPenjual(formData);
      return res.status(200).json({
        status: true,
        message: 'Penjual berhasil didaftarkan!',
      });
    } catch (error) {
      if (error.errno === 1062) {
        return res.status(400).json({
          status: false,
          message: 'Username, email atau id sudah terdaftar!',
        });
      }
      return res.status(500).json({
        status: false,
        message: `Error: Post penjual fails, ${error.message}`,
      });
    }
  },
);

module.exports = router;
