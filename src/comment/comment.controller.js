const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getCommentByKodeProduk,
  createComment,
  removeComment,
} = require('./comment.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const find = req.query.kode_produk;
    const comment = await getCommentByKodeProduk(find);
    if (comment.length !== 0) {
      return res.status(200).json({
        status: true,
        message: `Data Komentar`,
        results: comment,
      });
    }
    return res.status(400).json({
      status: true,
      message: 'Fail: Komentar tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Komentar by kode_produk code Fail, ${error.message}`,
    });
  }
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.none(),
  [
    body('text').notEmpty(),
    body('rating').notEmpty(),
    body('idKeranjang').notEmpty(),
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
      let formData = {
        text: req.body.text,
        rating: req.body.rating,
        id_keranjang: req.body.idKeranjang,
      };
      const result = await createComment(formData);
      return res.status(200).json({
        status: true,
        message: 'Komentar berhasil ditambahkan!',
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Comment Fail, ${error.message}`,
        error,
      });
    }
  },
);

router.delete('/(:id_comment)', apiKeyMiddleware, async (req, res) => {
  let id_comment = req.params.id_comment;
  try {
    const comment = await removeComment(id_comment);
    if (comment.length !== 0) {
      return res.status(200).json({
        status: true,
        message: 'Komentar berhasil dihapus!',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Komentar tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: delete Komentar Fail, ${error.message}`,
      error,
    });
  }
});

module.exports = router;
