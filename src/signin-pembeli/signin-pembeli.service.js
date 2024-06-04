const {
    findPembeliByEmail,
} = require('./signin-pembeli.repository.js')
const { hashPassword, comparePassword,} = require("../helper/hash.js");

async function getPembeliByEmail(email) {
    try {
      const results = await findPembeliByEmail(email);
      if (results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  
  async function authentikasiPembeli(formData) {
    try {
      const users = await getPembeliByEmail(formData.email);
      if (users) {
        const isPasswordValid = comparePassword(
          formData.password,
          users.password
        );
        return isPasswordValid
          ? {
              isSuccess: true,
              data: users,
            }
          : {
              isSuccess: false,
            };
      }
      return {
        isSuccess: false,
      };
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    authentikasiPembeli,
}