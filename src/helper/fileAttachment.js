const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "fotoProduk") {
      cb(null, "./public/product_images/");
    }
    else if (file.fieldname == "fotoProfil" || file.fieldname == "fotoBanner"){
        cb(null, "./public/store_images/")
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

module.exports = upload;
