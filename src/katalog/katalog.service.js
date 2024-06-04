const {
  showKatalogs,
  insertKatalog,
  updateKatalog,
  deleteKatalog,
  findKatalogByProductCode,
} = require('./katalog.repository.js');
const codeGenerator = require('../helper/codegenerator.js');
const { removeFile } = require('../helper/fileRemover.js');
const { datePicker } = require('../helper/datePicker.js');

async function getKatalogs(nama_produk) {
  try {
    const users = await showKatalogs(nama_produk);
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
    const results = await getKatalogByProductCode(id);
    if (formData.foto_produk) {
      let filePath = './public/product_images/' + results.foto_produk;
      removeFile(filePath);
    }
    if (results) {
      const users = await updateKatalog(formData, id);
      return users;
    }
  } catch (error) {
    throw error;
  }
}

async function removeKatalog(kode_produk) {
  try {
    const results = await getKatalogByProductCode(kode_produk);
    if (results) {
      const deleted_date = datePicker();
      const users = await deleteKatalog(deleted_date, kode_produk);
      return true;
    }
    return false;
    // let filePath = "./public/product_images/" + results.foto_produk;
    // removeFile(filePath);
  } catch (error) {
    throw error;
  }
}

async function getKatalogByProductCode(kode_produk) {
  try {
    const results = await findKatalogByProductCode(kode_produk);
    if (results.length > 0) {
      return results[0];
    }
    throw new Error('Produk Tidak Ditemukan');
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getKatalogs,
  createKatalog,
  editKatalog,
  removeKatalog,
  getKatalogByProductCode,
};
