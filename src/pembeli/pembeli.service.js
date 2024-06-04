const {
  showPembeli,
  insertPembeli,
  findPembeliByEmail,
  findPembeliById,
  updateToken,
} = require('./pembeli.repository.js');
const { hashPassword, comparePassword } = require('../helper/hash.js');
const { generateToken } = require('../helper/tokengenerator.js');

async function getPembeli() {
  try {
    const users = await showPembeli();
    return users;
  } catch (error) {
    throw error;
  }
}

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
async function getPembeliById(id) {
  try {
    const results = await findPembeliById(id);
    if (results.length > 0) {
      return results[0];
    }
    throw new Error('ID tidak ditemukan');
  } catch (error) {
    throw error;
  }
}

async function addPembeli(formData) {
  try {
    const users = await insertPembeli(formData);
    return users;
  } catch (error) {
    throw error;
  }
}

async function saveToken(id) {
  try {
    const token = generateToken();
    await updateToken(token, id);
    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPembeli,
  addPembeli,
  saveToken,
  getPembeliById,
};
