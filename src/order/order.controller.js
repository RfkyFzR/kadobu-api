const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../helper/fileAttachment.js');
const { getOrders, createOrder, editOrderStatus } = require('./order.service.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const find = req.query.cari || '';
    const responseOrder = await getOrders(find);
    if (responseOrder.length !== 0) {
      return res.status(200).json({
        status: true,
        message: 'List Data Order',
        data: responseOrder,
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Success: Order tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Order Fail, ${error.message}`,
    });
  }
});

router.patch(
  '/:idOrder',
  apiKeyMiddleware,
  upload.none(),
  [
    body('status').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Data tidak boleh kosong',
        errors: errors.array(),
      });
    }
    try {
      let id_order = req.params.idOrder;
      let status = req.body.status;
      await editOrderStatus(id_order, status);
      return res.status(200).json({
        status: true,
        message: 'Success: Update Status Order!',
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Patch Orders Fail, ${error.message}`,
        error,
      });
    }
  },
);

router.post(
  '/',
  apiKeyMiddleware,
  upload.none(),
  [
    body('idPembeli').notEmpty(),
    body('kodeProduk').notEmpty(),
    body('keterangan').notEmpty(),
    body('totalPesanan').notEmpty(),
    body('idPenjual').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: 'Data tidak boleh kosong',
        errors: errors.array(),
      });
    }
    try {
      let formData = {
        kode_pesanan: req.body.kodePesanan,
        status: 'Pending',
        id_pembeli: req.body.idPembeli,
        kode_produk: req.body.kodeProduk,
        keterangan: req.body.keterangan,
        total_pesanan: req.body.totalPesanan,
        total_harga: req.body.totalHarga,
        total_penjualan: req.body.totalPenjualan,
      };
      id_penjual = req.body.idPenjual;

      const order = await createOrder(formData, id_penjual);

      return res.status(200).json({
        status: true,
        message: 'Success: Create Orders!',
        data: order,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Create Orders Fail, ${error.message}`,
        error,
      });
    }
  },
);

module.exports = router;
