const {
  showKeranjangByIdPembeli,
  showKeranjangByIdToko,
  insertKeranjang,
  deleteKeranjang,
  findKeranjangById,
  updateStatusAndKeteranganKeranjang,
  findKeranjangByIdAndIdToko,
} = require('./keranjang.repository.js');

const { getKatalogByProductCode } = require('../katalog/katalog.service.js');
const { decrementStockProduk } = require('../katalog/katalog.repository.js');

async function editStatusAndKeteranganKeranjang(id, status, keterangan) {
  try {
    const result = await updateStatusAndKeteranganKeranjang(
      id,
      status,
      keterangan,
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function getKeranjangByIdPembeli(id_pembeli) {
  try {
    const keranjang = await showKeranjangByIdPembeli(id_pembeli);

    return keranjang;
  } catch (error) {
    throw error;
  }
}
async function getKeranjangByIdAndIdToko(id, id_toko) {
  try {
    const keranjang = await findKeranjangByIdAndIdToko(id, id_toko);
    if (keranjang.length > 0) {
      return keranjang[0];
    }
    return null;
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

async function editStatusAndKeteranganKeranjang(
  id_keranjang,
  status,
  keterangan,
) {
  try {
    const results = await updateStatusAndKeteranganKeranjang(
      id_keranjang,
      status,
      keterangan,
    );
    return results;
    throw new Error('Keranjang Tidak Ditemukan');
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getKeranjangByIdPembeli,
  editStatusAndKeteranganKeranjang,
  getKeranjangByIdToko,
  createKeranjang,
  removeKeranjang,
  getKeranjangById,
  getKeranjangByIdAndIdToko,
};
