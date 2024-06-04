const {
    insertPenjual,
} = require ('./signup-penjual.repository.js')
const { hashPassword, comparePassword,} = require("../helper/hash.js");

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
    createPenjual,
}