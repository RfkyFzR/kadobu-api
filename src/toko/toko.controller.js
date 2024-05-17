const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { getKatalogsAndStoreById } = require("./toko.service.js");


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

  module.exports = router;