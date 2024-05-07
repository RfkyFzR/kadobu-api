const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getKatalogs,
  createKatalog,
  removeKatalog,
  editKatalog,
  searchKatalog
} = require("./katalog.service.js");

router.get("/", async (req, res) => {
  const responseKatalog = await getKatalogs();
  return res.status(200).json({
    status: true,
    message: "List Data Katalog",
    data: responseKatalog,
  });
});

router.post(
  "/",
  [
    body("namaProduk").notEmpty(),
    body("deskripsiProduk").notEmpty(),
    body("stokProduk").notEmpty(),
    body("hargaProduk").notEmpty(),
    body("fotoProduk").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let formData = {
      kode_produk: req.body.kodeProduk,
      nama_produk: req.body.namaProduk,
      deskripsi_produk: req.body.deskripsiProduk,
      stok_produk: req.body.stokProduk,
      harga_produk: req.body.hargaProduk,
      foto: req.body.fotoProduk,
    };
    await createKatalog(formData);
    return res.status(200).json({
      status: true,
      message: "Katalog berhasil ditambahkan!",
      data: formData,
    });
  }
);

router.patch(
  "/:id",
  [
    body("namaProduk").notEmpty(),
    body("deskripsiProduk").notEmpty(),
    body("stokProduk").notEmpty(),
    body("hargaProduk").notEmpty(),
    body("fotoProduk").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let id = req.params.id;
    let formData = {
      nama_produk: req.body.namaProduk,
      deskripsi_produk: req.body.deskripsiProduk,
      stok_produk: req.body.stokProduk,
      harga_produk: req.body.hargaProduk,
      foto: req.body.fotoProduk,
    };
    await editKatalog(formData, id);
    return res.status(200).json({
      status: true,
      message: "Katalog berhasil dirubah!",
      data: formData,
    });
  }
);

router.delete("/(:id)", async (req, res) => {
  let id = req.params.id;
  await removeKatalog(id);
  const showKatalogs = await getKatalogs();
  return res.status(200).json({
    status: true,
    message: "Katalog berhasil dihapus!",
    data: showKatalogs,
  });
});

router.get(
  "/:keywords",
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let keywords = req.params.keywords;

    const result = await searchKatalog(keywords);
    return res.status(200).json({
      status: true,
      message: "Katalog berhasil ditemukan!",
      result,
    });
  }
);

module.exports = router;
