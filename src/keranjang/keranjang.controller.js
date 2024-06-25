const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getKeranjangByIdPembeli,
  getKeranjangByIdToko,
  createKeranjang,
  removeKeranjang,
  getKeranjangByIdAndIdToko,
} = require('./keranjang.service.js');
const upload = require('../helper/fileAttachment.js');
const apiKeyMiddleware = require('../helper/apiAuth.js');
const {
  updateStatusAndKeteranganKeranjang,
} = require('./keranjang.repository.js');

router.get('/:id', apiKeyMiddleware, async (req, res) => {
  try {
    // return res.status(200).json({
    //   status: true,
    //   id: req.params.id,
    //   idToko: req.query.id_toko,
    // });
    const id_toko = req.query.id_toko;
    const id = req.params.id;
    const response = await getKeranjangByIdAndIdToko(id, id_toko);
    return res.status(200).json({
      status: true,
      message: `Data Keranjang ${id}`,
      data: response,
    });
    // if (responseKatalog.length !== 0) {
    //   return res.status(200).json({
    //     status: true,
    //     message: `Data Katalog ${kode_produk}`,
    //     data: responseKatalog,
    //   });
    // }
    // return res.status(400).json({
    //   status: true,
    //   message: 'Fail: Katalog tidak ditemukan!',
    // });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Katalog by product code Fail, ${error.message}`,
    });
  }
});

router.get('/', apiKeyMiddleware, async (req, res) => {
  const find = req.query.id_pembeli || req.query.id_toko;
  if (req.query.id_pembeli) {
    try {
      const keranjang = await getKeranjangByIdPembeli(find);
      if (keranjang.length !== 0) {
        return res.status(200).json({
          status: true,
          message: `Data Keranjang`,
          results: keranjang,
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Fail: Keranjang by id pembeli tidak ditemukan!',
        results: keranjang,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Get Keranjang by id_pembeli code Fail, ${error.message}`,
      });
    }
  } else if (req.query.id_toko) {
    try {
      const keranjang = await getKeranjangByIdToko(find);
      if (keranjang.length !== 0) {
        return res.status(200).json({
          status: true,
          message: `Data Keranjang`,
          results: keranjang,
        });
      }
      return res.status(400).json({
        status: true,
        message: 'Fail: Keranjang tidak ditemukan!',
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Get Keranjang by id_toko code Fail, ${error.message}`,
      });
    }
  }
});

router.post(
  '/',
  apiKeyMiddleware,
  upload.none(),
  [
    body('idPembeli').notEmpty(),
    body('kodeProduk').notEmpty(),
    body('jumlahPesanan').notEmpty(),
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
        errors: errors.array(),
      });
    }
    try {
      let formData = {
        id_pembeli: req.body.idPembeli,
        // id_order
        kode_produk: req.body.kodeProduk,
        jumlah_pesanan: req.body.jumlahPesanan,
        total_harga: null,
        status_keranjang: 'NOT_PAID',
        catatan: req.body.catatan || '',
      };
      await createKeranjang(formData);
      return res.status(200).json({
        status: true,
        message: 'Keranjang berhasil ditambahkan!',
        data: formData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Keranjang Fail, ${error.message}`,
        error,
      });
    }
  },
);
router.patch(
  '/:id',
  apiKeyMiddleware,
  upload.none(),
  [body('status').notEmpty(), body('keterangan').notEmpty()],
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
        errors: errors.array(),
      });
    }
    try {
      await updateStatusAndKeteranganKeranjang(
        req.params.id,
        req.body.status,
        req.body.keterangan,
      );
      return res.status(200).json({
        status: true,
        message: 'Keranjang berhasil Update!',
        data: {
          status: req.body.status,
          keterangan: req.body.keterangan,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Keranjang Fail, ${error.message}`,
        error,
      });
    }
  },
);

router.delete('/(:id_keranjang)', apiKeyMiddleware, async (req, res) => {
  let id_keranjang = req.params.id_keranjang;
  try {
    const keranjang = await removeKeranjang(id_keranjang);
    if (keranjang.length !== 0) {
      return res.status(200).json({
        status: true,
        message: 'Keranjang berhasil dihapus!',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Keranjang tidak ditemukan!',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: delete Keranjang Fail, ${error.message}`,
      error,
    });
  }
});

// router.get("/", apiKeyMiddleware, async (req, res) => {
//   try {
//     const find = req.query.id_pembeli
//     const keranjang = await getKeranjangByIdPembeli(find);
//     if (keranjang.length !== 0) {
//       return res.status(200).json({
//         status: true,
//         message: `Data Keranjang`,
//         results: keranjang,
//       });
//     }
//     return res.status(400).json({
//       status: true,
//       message: "Fail: Keranjang tidak ditemukan!",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: `Error: Get Keranjang by id_pembeli code Fail, ${error.message}`,
//     });
//   }
// });

// router.get("/", apiKeyMiddleware, async (req, res) => {
//   try {
//     const find = req.query.id_toko;
//     const keranjang = await getKeranjangByIdToko(find);
//     if (keranjang.length !== 0) {
//       return res.status(200).json({
//         status: true,
//         message: `Data Keranjang`,
//         results: keranjang,
//       });
//     }
//     return res.status(400).json({
//       status: true,
//       message: "Fail: Keranjang tidak ditemukan!",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: `Error: Get Keranjang by id_toko code Fail, ${error.message}`,
//     });
//   }
// });

module.exports = router;
