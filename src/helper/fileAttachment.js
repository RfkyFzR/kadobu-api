const multer = require('multer');

    let storage = multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, "./src/public/images/");
        },
        filename: function(req, file, cb){
            
            cb(null, Date.now() + "-" + file.originalname)
        },
    })
    const upload = multer({
        storage: storage
    })

module.exports = upload;