const { hashPassword, comparePassword,} = require("../helper/hash.js");
const {
    insertPembeli,
} = require('./signup-pembeli.repository.js');

async function createPembeli(formData) {
    try {
      const encryptPassword = hashPassword(formData.password);
      formData.password = encryptPassword;
      const users = await insertPembeli(formData);
      return users;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    createPembeli,
}