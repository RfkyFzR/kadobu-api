const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
    getPenjual,
    createPenjual,
    authentikasiPembeli,
    saveToken,
  } = require("./penjual.service.js");
  const upload = require('../helper/fileAttachment.js');

router.get("/", async (req, res) => { 
    const responsePenjual = await getPenjual();
    return res.status(200).json({
      status: true,
      message: "List Data Penjual",
      data: responsePenjual,
    });
  });

  router.post(
    "/",
    upload.none(),
    [
      body("username").notEmpty(),
      body("password").notEmpty(),
      body("email").notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
      }
      let formData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      };
      try {
        await createPenjual(formData);
        return res.status(200).json({
          status: true,
          message: "Penjual berhasil didaftarkan!",
          data: formData,
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Username atau email sudah digunakan!",
        });
      }
    }
  );


  module.exports = router;