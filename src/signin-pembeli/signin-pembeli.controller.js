const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
    authentikasiPembeli,
} = require('./signin-pembeli.service.js');
const upload = require("../helper/fileAttachment.js");
const jwt = require("jsonwebtoken");

router.post(
  "/",
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
      console.log(data);
      
      if (data.isSuccess) {
        const token = jwt.sign(data, process.env.MY_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
          httpOnly: true,
        //   secure: true,
        //   domain: "localhost",
        //   maxAge: 2628000000,
        //   expires: new Date(Date.now() + 2628000000),
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
