const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getWishlistByIdPembeli,
  createWishlist,
  removeWishlist,
} = require("./wishlist.service.js");
const upload = require("../helper/fileAttachment.js");
const apiKeyMiddleware = require("../helper/apiAuth.js");

router.get("/", apiKeyMiddleware, async (req, res) => {
  try {
    const find = req.query.id_pembeli;
    const wishlist = await getWishlistByIdPembeli(find);
    if (wishlist.length !== 0) {
      return res.status(200).json({
        status: true,
        message: `Data Wishlist`,
        results: wishlist,
      });
    }
    return res.status(400).json({
      status: true,
      message: "Fail: Wishlist tidak ditemukan!",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: Get Wishlist by id_pembeli code Fail, ${error.message}`,
    });
  }
});

router.post(
  "/",
  apiKeyMiddleware,
  upload.none(),
  [body("idPembeli").notEmpty(), body("kodeProduk").notEmpty()],
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
        message: "Data tidak boleh kosong",
        // errors: errors.array(),
      });
    }
    try {
      let formData = {
        id_wishlist: req.body.idWishlist,
        id_pembeli: req.body.idPembeli,
        kode_produk: req.body.kodeProduk,
      };
      await createWishlist(formData);
      return res.status(200).json({
        status: true,
        message: "Wishlist berhasil ditambahkan!",
        data: formData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: Post Wishlist Fail, ${error.message}`,
        error,
      });
    }
  }
);

router.delete("/(:id_wishlist)", apiKeyMiddleware, async (req, res) => {
  let id_wishlist = req.params.id_wishlist;
  try {
    const wishlist = await removeWishlist(id_wishlist);
    if (wishlist.length !== 0) {
      return res.status(200).json({
        status: true,
        message: "Wishlist berhasil dihapus!",
      });
    }
    return res.status(400).json({
      status: false,
      message: "Wishlist tidak ditemukan!",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error: delete Wishlist Fail, ${error.message}`,
      error,
    });
  }
});

module.exports = router;
