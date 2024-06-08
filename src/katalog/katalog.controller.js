const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getKatalogByStoreId,
  getKatalogs,
  createKatalog,
  removeKatalog,
  editKatalog,
  getKatalogByProductCode,
} = require('./katalog.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:kode_produk', apiKeyMiddleware, async (req, res) => {
  try {
    const kode_produk = req.params.kode_produk;
    const responseKatalog = await getKatalogByProductCode(kode_produk);
    if (responseKatalog.length !== 0) {
      return res.status(200).json({
        status: true,
        message: `Data Katalog ${kode_produk}`,
        data: responseKatalog,
      });
    }
    return res.status(400).json({
      status: true,
      message: 'Fail: Katalog tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Katalog by product code Fail, ${error.message}`,
    });
  }
});

router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const find = req.query.cari || '';
    const storeId = req.query.storeId;
    let responseKatalog;
    if (storeId) {
      responseKatalog = await getKatalogByStoreId(storeId);
    } else {
      responseKatalog = await getKatalogs(find);
    }
    if (responseKatalog.length !== 0) {
      return res.status(200).json({
        status: true,
        message: 'List Data Katalog',
        data: responseKatalog,
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Success: Katalog tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Katalogs Fail, ${error.message}`,
    });
  }
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.single('fotoProduk'),
  [
    body('namaProduk').notEmpty(),
    body('deskripsiProduk').notEmpty(),
    body('stokProduk').notEmpty(),
    body('hargaProduk').notEmpty(),
    body('status').notEmpty(),
    body('idToko').notEmpty(),
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
        status: false,
        message: 'Data tidak boleh kosong',
        // errors: errors.array(),
      });
    }
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'Foto tidak boleh kosong!',
        });
      }
      let formData = {
        kode_produk: req.body.kodeProduk,
        nama_produk: req.body.namaProduk,
        deskripsi_produk: req.body.deskripsiProduk,
        stok_produk: req.body.stokProduk,
        harga_produk: req.body.hargaProduk,
        foto_produk: req.file.filename,
        status_produk: req.body.status,
        id_toko: req.body.idToko,
      };
      await createKatalog(formData);
      return res.status(200).json({
        status: true,
        message: 'Katalog berhasil ditambahkan!',
        data: formData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Katalogs Fail, ${error.message}`,
        error,
      });
    }
  },
);

router.patch(
  '/:id',
  apiKeyMiddleware,
  upload.single('fotoProduk'),
  [
    body('namaProduk').notEmpty(),
    body('deskripsiProduk').notEmpty(),
    body('stokProduk').notEmpty(),
    body('hargaProduk').notEmpty(),
    body('status').notEmpty(),
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
    let formData = {
      nama_produk: req.body.namaProduk,
      deskripsi_produk: req.body.deskripsiProduk,
      stok_produk: req.body.stokProduk,
      harga_produk: req.body.hargaProduk,
      status_produk: req.body.status,
    };
    const id = req.params.id;
    try {
      if (req.file) {
        formData = {
          ...formData,
          foto_produk: req.file.filename,
        };
      }
      await editKatalog(formData, id);
      return res.status(200).json({
        status: true,
        message: 'Katalog berhasil dirubah!',
        data: formData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,

        message: `Error: Patch Katalogs Fail, ${error.message}`,
        error,
      });
    }
  },
);

router.delete('/(:kode_produk)', apiKeyMiddleware, async (req, res) => {
  let kode_produk = req.params.kode_produk;
  try {
    const isSuccess = await removeKatalog(kode_produk);
    if (isSuccess) {
      return res.status(200).json({
        status: true,
        message: 'Katalog berhasil dihapus!',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Katalog tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: delete Katalogs Fail, ${error.message}`,
      error,
    });
  }
});

module.exports = router;
