const {
  showPenggunas,
  insertPengguna,
  findPenggunasByEmail,
  updateToken,
} = require("./pengguna.repository.js");
const { hashPassword, comparePassword,} = require("../helper/hash.js");
const { generateToken } = require("../helper/tokengenerator.js")

async function getPengguna() {
  try {
    const users = await showPenggunas();
    return users;
  } catch (error) {
    throw error;
  }
}

async function getPenggunaByEmail(email) {
  try {
    const results = await findPenggunasByEmail(email);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function createPengguna(formData) {
  try {
    const encryptPassword = hashPassword(formData.password);
    formData.password = encryptPassword;
    const users = await insertPengguna(formData);
    return users;
  } catch (error) {
    throw error;
  }
}

async function authentikasiPengguna(formData) {
  try {
    const users = await getPenggunaByEmail(formData.email);
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

async function saveToken(id) {
  try {
    const token = generateToken()
    await updateToken(token, id)
    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPengguna,
  createPengguna,
  authentikasiPengguna,
  saveToken,
};
