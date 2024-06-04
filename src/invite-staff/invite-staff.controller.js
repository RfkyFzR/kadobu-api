const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
    updateRole,
} = require ('./invite-staff.service.js');

const upload = require("../helper/fileAttachment.js");

router.post(
  "/",
  upload.any(),
  [
    body("idToko").notEmpty(),
    body("usernamePenjual").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let formData = {
        id_toko : req.body.idToko,
        username : req.body.usernamePenjual
    };

    const result = await updateRole(formData);
    return res.status(200).json({
      status: true,
      message: "Berhasil ditambahkan sebagai karyawan!",
      result,
    });
  }
);

module.exports = router;
