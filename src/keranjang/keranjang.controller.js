const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getKeranjangByIdPembeli,
  getKeranjangByIdToko,
  createKeranjang,
  removeKeranjang,
} = require("./keranjang.service.js");
const upload = require("../helper/fileAttachment.js");
const apiKeyMiddleware = require("../helper/apiAuth.js");

router.get("/", apiKeyMiddleware, async (req, res) => {
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
      return res.status(400).json({
        status: true,
        message: "Fail: Keranjang tidak ditemukan!",
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
        message: "Fail: Keranjang tidak ditemukan!",
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
    body('idOrder').notEmpty(),
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
        // errors: errors.array(),
      });
    }
    try {
      let formData = {
        id_keranjang: req.body.idKeranjang,
        id_pembeli: req.body.idPembeli,
        id_order: req.body.idOrder,
        jumlah_pesanan: req.body.jumlahPesanan,
        total_harga: req.body.totalHarga,
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

router.delete("/(:id_keranjang)", apiKeyMiddleware, async (req, res) => {
  let id_keranjang = req.params.id_keranjang;
  try {
    const keranjang = await removeKeranjang(id_keranjang);
    if (keranjang.length !== 0) {
      return res.status(200).json({
        status: true,
        message: "Keranjang berhasil dihapus!",
      });
    }
    return res.status(400).json({
      status: false,
      message: "Keranjang tidak ditemukan!",
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
