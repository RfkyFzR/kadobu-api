const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "fotoProduk") {
      cb(null, "./public/product_images/");
    } else if (file.fieldname == "fotoProfil") {
      cb(null, "./public/store_images/");
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now().toString() + path.extname(file.originalname).toLowerCase()
    );
  },
});

const multerFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    req.fileValidationError =
      "File Foto Harus Berekstensi jpg, jpeg, atau png!";
    return cb(null, false, req.fileValidationError);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports = upload;
