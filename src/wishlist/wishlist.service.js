const {
  showWishlistByIdPembeli,
  showWishlistByIdProdukAndIdPembeli,
  insertWishlist,
  deleteWishlist,
} = require("./wishlist.repository.js");

async function getWishlistByIdPembeli(id_pembeli) {
  try {
    const wishlist = await showWishlistByIdPembeli(id_pembeli);
    return wishlist;
  } catch (error) {
    throw error;
  }
}

async function getWishlistByIdProdukAndIdPembeli(kode_produk, id_pembeli) {
  try {
    const wishlist = await showWishlistByIdProdukAndIdPembeli(kode_produk, id_pembeli);
    return wishlist;
  } catch (error) {
    throw error;
  }
}

async function createWishlist(formData) {
  try {
    const wishlist = await insertWishlist(formData);
    return wishlist;
  } catch (error) {
    throw error;
  }
}

async function removeWishlist(id_wishlist) {
  try {
    const wishlist = await deleteWishlist(id_wishlist);
    return wishlist;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getWishlistByIdPembeli,
  getWishlistByIdProdukAndIdPembeli,
  createWishlist,
  removeWishlist,
};
