const express = require("express");
const router = express.Router();
const {body, validationResult} = require('express-validator');
const { getPengguna, createPengguna } = require("./pengguna.service.js");

router.get("/", async (req, res) => {
  const responsePengguna = await getPengguna();
  return res.status(200).json({
      status: true,
      message: "List Data Pengguna",
      data: responsePengguna,
  })
});

router.post("/", [
  body('username').notEmpty(),
  body('password').notEmpty(),
  body('email').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors : errors.array()
        });
    }
    let formData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }
  try {
    await createPengguna(formData);
    return res.status(200).json({
      status: true,
      message: "Pengguna berhasil didaftarkan!",
      data: formData,
  })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Username atau email sudah digunakan!"
    });
  }
});

module.exports = router;
