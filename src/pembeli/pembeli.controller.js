const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getPembeli,
  getPembeliById,
  addPembeli,
} = require('./pembeli.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:id', apiKeyMiddleware, async (req, res) => {
  const responsePengguna = await getPembeliById(req.params.id);
  return res.status(200).json({
    status: true,
    message: 'List Data Pengguna',
    data: responsePengguna,
  });
});
router.get('/', apiKeyMiddleware, async (req, res) => {
  const responsePengguna = await getPembeli();
  return res.status(200).json({
    status: true,
    message: 'List Data Pengguna',
    data: responsePengguna,
  });
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.any(),
  [
    body('idPembeli').notEmpty(),
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
      id_pembeli: req.body.idPembeli,
      email: req.body.email,
      username: req.body.username,
    };
    try {
      await addPembeli(formData);
      return res.status(200).json({
        status: true,
        message: 'Pembeli berhasil didaftarkan!',
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
        message: `Error: Post pembeli fails, ${error.message}`,
      });
    }
  },
);

module.exports = router;
