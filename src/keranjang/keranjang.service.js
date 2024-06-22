const {
  showKeranjangByIdPembeli,
  showKeranjangByIdToko,
  insertKeranjang,
  deleteKeranjang,
  findKeranjangById,
} = require('./keranjang.repository.js');

const { getOrderById } = require('../order/order.service.js');

const { getKatalogByProductCode } = require('../katalog/katalog.service.js');

async function getKeranjangByIdPembeli(id_pembeli) {
  try {
    const keranjang = await showKeranjangByIdPembeli(id_pembeli);

    return keranjang;
  } catch (error) {
    throw error;
  }
}

async function getKeranjangByIdToko(id_toko) {
  try {
    const keranjang = await showKeranjangByIdToko(id_toko);
    return keranjang;
  } catch (error) {
    throw error;
  }
}

async function createKeranjang(formData) {
  try {
    const katalog = await getKatalogByProductCode(formData.kode_produk);
    formData.total_harga = formData.jumlah_pesanan * katalog.harga_produk;
    const keranjang = await insertKeranjang(formData);
    return keranjang;
  } catch (error) {
    throw error;
  }
}

async function removeKeranjang(id_keranjang) {
  try {
    const keranjang = await deleteKeranjang(id_keranjang);
    return keranjang;
  } catch (error) {
    throw error;
  }
}

async function getKeranjangById(id_keranjang) {
  try {
    const results = await findKeranjangById(id_keranjang);
    if (results.length > 0) {
      return results[0];
    }
    throw new Error('Keranjang Tidak Ditemukan');
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getKeranjangByIdPembeli,
  getKeranjangByIdToko,
  createKeranjang,
  removeKeranjang,
  getKeranjangById,
};
