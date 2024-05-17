const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getKatalogs,
  createKatalog,
  removeKatalog,
  editKatalog,
  searchKatalog,
} = require("./katalog.service.js");
const upload = require('../helper/fileAttachment.js');

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
  upload.single("fotoProduk"),
  [
    body("namaProduk").notEmpty(),
    body("deskripsiProduk").notEmpty(),
    body("stokProduk").notEmpty(),
    body("hargaProduk").notEmpty(),
    body("status").notEmpty(),
    body("idToko").notEmpty(),
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
      foto_produk: "/images/" + req.file.filename,
      status_produk: req.body.status,
      id_toko: req.body.idToko,
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
  upload.single("fotoProduk"),
  [
    body("namaProduk").notEmpty(),
    body("deskripsiProduk").notEmpty(),
    body("stokProduk").notEmpty(),
    body("hargaProduk").notEmpty(),
    body("status").notEmpty(),
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
      foto_produk: "/images/" + req.file.filename,
      status_produk: req.body.status,
    };
    try {
      await editKatalog(formData, id);
      return res.status(200).json({
        status: true,
        message: "Katalog berhasil dirubah!",
        data: formData,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
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

router.get("/:keywords", async (req, res) => {
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
});

module.exports = router;
