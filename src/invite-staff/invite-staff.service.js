const {
    updateRoleKaryawan,
} = require ('../penjual/penjual.repository');

async function updateRole(formData) {
    try {
      const users = await updateRoleKaryawan(formData);
      return users;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    updateRole,
}