const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getKatalogsAndStoreById,
  createToko,
  editToko,
} = require('./toko.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:id', apiKeyMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let id = req.params.id;

  const result = await getKatalogsAndStoreById(id);
  return res.status(200).json({
    status: true,
    message: 'Katalog Tersedia pada toko:',
    result,
  });
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.single('fotoProfil'),
  [
    body('idToko').notEmpty(),
    body('namaToko').notEmpty(),
    body('deskripsiToko').notEmpty(),
    body('alamatToko').notEmpty(),
    body('teleponToko').notEmpty(),
    body('lokasiToko').notEmpty(),
    body('idPenjual').notEmpty(),
  ],
  async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({
        status: false,
        message: req.fileValidationError,
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let id_penjual = req.body.idPenjual;
    let formData = {
      id_toko: req.body.idToko,
      nama_toko: req.body.namaToko,
      deskripsi_toko: req.body.deskripsiToko,
      alamat_toko: req.body.alamatToko,
      telepon_toko: req.body.teleponToko,
      lokasi_toko: req.body.lokasiToko,
      foto_profil: req.file.filename,
    };
    await createToko(formData, id_penjual);
    return res.status(200).json({
      status: true,
      message: 'Toko berhasil dibuat!',
      data: formData,
    });
  },
);

router.patch(
  '/:idToko',
  apiKeyMiddleware,
  upload.single('fotoProfil'),
  [
    body('namaToko').notEmpty(),
    body('deskripsiToko').notEmpty(),
    body('alamatToko').notEmpty(),
    body('lokasiToko').notEmpty(),
    body('teleponToko').notEmpty(),
  ],
  async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({
        status: false,
        message: req.fileValidationError,
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: "Data tidak boleh kosong!",
      });
    }
    let id_toko = req.params.idToko;
    let formData = {
      nama_toko: req.body.namaToko,
      deskripsi_toko: req.body.deskripsiToko,
      telepon_toko: req.body.teleponToko,
      lokasi_toko: req.body.lokasiToko,
      alamat_toko: req.body.alamatToko,
    };
    if (req.file) {
      formData = {
        ...formData,
        foto_profil: req.file.filename,
      };
    }
    await editToko(formData, id_toko);
    return res.status(200).json({
      status: true,
      message: 'Toko berhasil dirubah!',
      data: formData,
    });
  },
);

module.exports = router;
