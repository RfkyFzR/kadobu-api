const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../helper/fileAttachment.js');
const {
  getOrders,
  getOrdersByStoreId,
  getOrdersByUserId,
  createOrder,
  createGuestOrder,
  getOrdersByCodeAndStoreId,
  editOrderStatusAndKeterangan,
  getOrdersByUserIdAndStatus,
} = require('./order.service.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');

router.get('/:kode_pesanan', apiKeyMiddleware, async (req, res) => {
  try {
    const kode = req.params.kode_pesanan;
    const storeId = req.query.storeId;

    const responseOrder = await getOrdersByCodeAndStoreId(kode, storeId);
    if (responseOrder) {
      return res.status(200).json({
        status: true,
        message: 'List Data Order ',
        data: responseOrder,
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Fail: Order tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Order By Product Code Fail, ${error.message}`,
    });
  }
});

router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const find = req.query.cari || '';
    const userId = req.query.userId;
    const storeId = req.query.storeId;
    const statusOrder = req.query.status;
    let responseOrder;
    let query;
    if (userId) {
      if (statusOrder) {
        responseOrder = await getOrdersByUserIdAndStatus(userId, statusOrder);
      } else {
        responseOrder = await getOrdersByUserId(userId);
      }
    } else if (storeId) {
      responseOrder = await getOrdersByStoreId(storeId);
    } else {
      responseOrder = await getOrders(find);
      query = 'cari all';
    }
    if (responseOrder.length !== 0) {
      return res.status(200).json({
        status: true,
        message: 'List Data Order ',
        data: responseOrder,
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Success: Order tidak ditemukan!',
      data: responseOrder,
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
  [body('status').notEmpty(), body('keterangan').notEmpty()],
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
      const responseOrder = await editOrderStatusAndKeterangan(
        id_order,
        req.body.status,
        req.body.keterangan,
      );
      return res.status(200).json({
        status: true,
        message: 'Success: Update Status Order!',
        data: responseOrder,
        payload: {
          id: id_order,
          status: req.body.status,
          keterangan: req.body.keterangan,
        },
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

    const isGuest = req.query.isGuest;

    try {
      let formData;
      let order;
      if (isGuest && isGuest === 'true') {
        formData = {
          status: 'PAID',
          id_pembeli: 'kadobu-guest',
          kode_produk: req.body.kodeProduk,
          keterangan: req.body.keterangan,
          total_pesanan: req.body.totalPesanan,
          jenis_pembayaran: 'bayar_ditempat',
        };
        order = await createGuestOrder(formData);
      } else {
        formData = {
          kode_pesanan: req.body.kodePesanan,
          status: 'PENDING',
          id_pembeli: req.body.idPembeli,
          kode_produk: req.body.kodeProduk,
          keterangan: req.body.keterangan,
          total_pesanan: req.body.totalPesanan,
          total_harga: req.body.totalHarga,
        };
        order = await createOrder(formData);
      }

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
