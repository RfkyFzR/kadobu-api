const {
  showPenjual,
  showPenjualById,
  insertPenjual,
} = require('./penjual.repository.js');

async function getPenjual() {
  try {
    const users = await showPenjual();
    return users;
  } catch (error) {
    throw error;
  }
}
async function getPenjualById(id) {
  try {
    const users = await showPenjualById(id);
    if (users.length > 0) {
      return users[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function addPenjual(formData) {
  try {
    const users = await insertPenjual(formData);
    return users;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPenjual,
  addPenjual,
  getPenjualById,
};
