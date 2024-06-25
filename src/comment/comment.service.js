const {
  showCommentByKodeProduk,
  insertComment,
  deleteComment,
  getCommentById,
} = require('./comment.repository.js');
const { getKeranjangById } = require('../keranjang/keranjang.service.js');
const { getOrderById } = require('../order/order.service.js');
const {
  updateIdKomenKeranjang,
} = require('../keranjang/keranjang.repository.js');

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
    const { insertId } = await insertComment({
      rating: formData.rating,
      text: formData.text,
      id_keranjang: formData.id_keranjang,
    });
    const keranjang = await updateIdKomenKeranjang(
      formData.id_keranjang,
      insertId,
    );
    return {
      id_komen: insertId,
      ...formData,
    };
    // const keranjang = await getKeranjangById(formData.id_keranjang);
    // console.log(keranjang);
    // const order = await getOrderById(keranjang.id_order);
    // if (order.status === "Accepted"){
    //     const comment = await insertComment(formData);
    //     return comment;
    // }
  } catch (error) {
    throw error;
  }
}

async function removeComment(id_comment) {
  try {
    const comments = await getCommentById(id_comment);
    const { id_keranjang } = await comments[0];
    const result = await updateIdKomenKeranjang(id_keranjang, 'NULL');
    await deleteComment(id_comment);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCommentByKodeProduk,
  createComment,
  removeComment,
};
