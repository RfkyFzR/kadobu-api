const fs = require("fs");

function removeFile(filePath) {
    return fs.unlinkSync(filePath)
};

module.exports = {
    removeFile,
}