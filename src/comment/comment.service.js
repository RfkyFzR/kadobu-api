const {
  showCommentByKodeProduk,
  insertComment,
  deleteComment,
} = require("./comment.repository.js");
const {
    getKeranjangById,
} = require('../keranjang/keranjang.service.js');
const { getOrderById, } = require("../order/order.service.js");

async function getCommentByKodeProduk(kode_produk) {
  try {
    const comment = await showCommentByKodeProduk(kode_produk);
    return comment;
  } catch (error) {
    throw error;
  }
}

async function createComment(formData) {
  try {
    const keranjang = await getKeranjangById(formData.id_keranjang);
    console.log(keranjang);
    const order = await getOrderById(keranjang.id_order);
    if (order.status === "Accepted"){
        const comment = await insertComment(formData);
        return comment;
    }
    throw new Error("Status produk belum diterima!");
  } catch (error) {
    throw error;
  }
}

async function removeComment(id_comment) {
    try {
      const comment = await deleteComment(id_comment);
      return comment;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
  getCommentByKodeProduk,
  createComment,
  removeComment,
};
