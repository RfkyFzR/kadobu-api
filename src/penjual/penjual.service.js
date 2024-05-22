const { showPenjual,
  insertPenjual,
 } = require("./penjual.repository.js");

 const { hashPassword, comparePassword,} = require("../helper/hash.js");

async function getPenjual() {
  try {
    const users = await showPenjual();
    return users;
  } catch (error) {
    throw error;
  }
}

async function createPenjual(formData) {
  try {
    const encryptPassword = hashPassword(formData.password);
    formData.password = encryptPassword;
    const users = await insertPenjual(formData);
    return users;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    getPenjual,
    createPenjual,
}