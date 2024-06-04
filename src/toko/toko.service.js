const {
  showKatalogsByIdStore,
  showStoreById,
  insertToko,
  updateToko,
  findTokoById
} = require("../toko/toko.repository.js");

const {
  updateFkPenjual
} = require("../penjual/penjual.repository.js")
const { removeFile } = require("../helper/fileRemover.js");

async function getKatalogsAndStoreById(id) {
  try {
    const katalog = await showKatalogsByIdStore(id);
    const store = await showStoreById(id);
    return {
      ...store[0],
      katalog,
    };
  } catch (error) {
    throw error;
  }
}

async function createToko(formData, id_penjual) {
  try {
    const toko = await insertToko(formData);
    await updateFkPenjual(toko.insertId, id_penjual)
    return toko;
  } catch (error) {
    throw error;
  }
}

async function getTokoById(id_toko) {
  try {
    const results = await findTokoById(id_toko);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function editToko(formData, id_toko) {
  try {
    const results = await getTokoById(id_toko);
    if (formData.foto_profil){
      let filePath = "./public/store_images/" + results.foto_profil;
      removeFile(filePath);
    }
    if (results) {
      const users = await updateToko(formData, id_toko);
      return users;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getKatalogsAndStoreById,
  createToko,
  editToko,
};
