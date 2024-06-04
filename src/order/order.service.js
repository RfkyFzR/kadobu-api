const { showOrders, insertOrder } = require("./order.repository.js");
const {
  findKatalogByProductCode,
  updateStockProduk,
} = require("../katalog/katalog.repository.js");
const orderCodeGenerator = require("../helper/OrderCodeGenerator.js");

async function getOrders(kode_pesanan) {
  try {
    const users = await showOrders(kode_pesanan);
    return users;
  } catch (error) {
    throw error;
  }
}

async function getKatalogByProductCode(kode_produk) {
  try {
    const results = await findKatalogByProductCode(kode_produk);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function createOrder(formData) {
  try {
    //mencari katalog dan menghitung total harga
    const results = await getKatalogByProductCode(formData.kode_produk);
    const sum = results.harga_produk * formData.total_pesanan;
    formData.total_harga = sum;
    //mengurangi stok produk dan melakukan update
    const stock = results.stok_produk - formData.total_pesanan
    await updateStockProduk(stock, formData.kode_produk);
    //generate kode produk
    const primaryKey = orderCodeGenerator(formData.kode_pesanan);
    formData.kode_pesanan = primaryKey;

    const order = await insertOrder(formData);
    return order;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrders,
};
