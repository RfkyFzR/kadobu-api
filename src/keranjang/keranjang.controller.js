const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getKeranjangByIdPembeli,
  getKeranjangByIdToko,
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
