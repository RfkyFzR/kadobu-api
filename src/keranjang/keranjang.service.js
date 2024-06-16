const {
  showKeranjangByIdPembeli,
  showKeranjangByIdToko,
} = require('./keranjang.repository.js')

async function getKeranjangByIdPembeli(id_pembeli) {
    try {
      const wishlist = await showKeranjangByIdPembeli(id_pembeli);
      return wishlist;
    } catch (error) {
      throw error;
    }
  }

  async function getKeranjangByIdToko(id_toko) {
    try {
      const wishlist = await showKeranjangByIdToko(id_toko);
      return wishlist;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
  getKeranjangByIdPembeli,
  getKeranjangByIdToko,
}