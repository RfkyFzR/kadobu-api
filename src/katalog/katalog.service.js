const {
  showKatalogs,
  insertKatalog,
  updateKatalog,
  deleteKatalog,
  findKatalogs,
  findKatalogById,
} = require("./katalog.repository.js");
const codeGenerator = require("../helper/codegenerator.js");
const fileUploader = require("../helper/fileAttachment.js");
const { removeFile } = require("../helper/fileRemover.js");

async function getKatalogs() {
  try {
    const users = await showKatalogs();
    return users;
  } catch (error) {
    throw error;
  }
}

async function createKatalog(formData) {
  try {
    const primaryKey = codeGenerator(formData.kode_produk);
    formData.kode_produk = primaryKey;
    const users = await insertKatalog(formData);
    return users;
  } catch (error) {
    throw error;
  }
}

async function editKatalog(formData, id) {
  try {
    const results = await getKatalogById(id);
    let filePath = "./src/public" + results.foto_produk
    removeFile(filePath)
    if (results) {
      const users = await updateKatalog(formData, id);
      return users;
    }
  } catch (error) {
    throw error;
  }
}

async function removeKatalog(id) {
  try {
    const users = await deleteKatalog(id);
    return users;
  } catch (error) {
    throw error;
  }
}

async function searchKatalog(keywords) {
  try {
    const users = await findKatalogs(keywords);
    return users;
  } catch (error) {
    throw error;
  }
}

async function getKatalogById(id) {
  try {
    const results = await findKatalogById(id);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

//   async function editKatalog(formData, id){

//     try {
//         const users = await updateKatalog(formData, id);
//         return users;
//     } catch (error) {
//         throw error;
//     }
// };

module.exports = {
  getKatalogs,
  createKatalog,
  editKatalog,
  removeKatalog,
  searchKatalog,
};
