const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getPembeli,
  createPembeli,
  authentikasiPembeli,
  saveToken,
} = require("./pembeli.service.js");
const upload = require('../helper/fileAttachment.js');

router.get("/", async (req, res) => {
  const responsePengguna = await getPembeli();
  return res.status(200).json({
    status: true,
    message: "List Data Pengguna",
    data: responsePengguna,
  });
});

router.post(
  "/",
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
      await createPembeli(formData);
      return res.status(200).json({
        status: true,
        message: "Pembeli berhasil didaftarkan!",
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

router.post(
  "/login",
  upload.any(),
  [body("password").notEmpty(), body("email").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let formData = {
      password: req.body.password,
      email: req.body.email,
    };
    try {
      const data = await authentikasiPembeli(formData);
      if (data.isSuccess) {
        const token = await saveToken(data.data.id);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          domain: "localhost",
          maxAge: 2628000000,
          expires: new Date(Date.now() + 2628000000),
        });
        return res.status(200).json({
          status: true,
          message: data.isSuccess
            ? "Login Berhasil"
            : "Email atau password salah!",
          data: {
            token,
            ...data,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
