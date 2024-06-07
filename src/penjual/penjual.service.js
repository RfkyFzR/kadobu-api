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
async function getPenjualById() {
  try {
    const users = await showPenjualById();
    return users;
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
};
