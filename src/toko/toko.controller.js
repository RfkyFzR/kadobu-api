const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { getKatalogsAndStoreById,
  createToko,
 } = require("./toko.service.js");
const upload = require("../helper/fileAttachment.js");


router.get("/:id", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let id = req.params.id;

  const result = await getKatalogsAndStoreById(id);
  return res.status(200).json({
    status: true,
    message: "Katalog Tersedia pada toko:",
    result,
  });
});

router.post(
  "/:idPenjual",
  upload.fields([
    {
      name: 'fotoProfil',
      maxCount: 1,
    },
    {
      name: 'fotoBanner',
      maxCount: 1,
    },
  ]),
  [
    body("namaToko").notEmpty(),
    body("deskripsiToko").notEmpty(),
    body("alamatToko").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let idPenjual = req.params.idPenjual
    let formData = {
      nama_toko: req.body.namaToko,
      deskripsi_toko: req.body.deskripsiToko,
      alamat_toko: req.body.alamatToko,
      foto_profil: req.files['fotoProfil'][0].filename,
      foto_banner: req.files['fotoBanner'][0].filename,
      id_penjual: idPenjual,
    };
    await createToko(formData);
    return res.status(200).json({
      status: true,
      message: "Toko berhasil dibuat!",
      data: formData,
    });
  }
);

module.exports = router;
