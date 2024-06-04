const { showOrders, insertOrder } = require('./order.repository.js');
const midtransClient = require('midtrans-client');
const {
  findKatalogByProductCode,
  updateStockProduk,
} = require('../katalog/katalog.repository.js');
const orderCodeGenerator = require('../helper/OrderCodeGenerator.js');
const { getPembeliById } = require('../pembeli/pembeli.service');

const { MIDTRANS_APP_URL, MIDTRANS_SERVER_KEY } = require('../config/midtrans');
const { FRONT_END_URL } = require('../config/frontend');

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
    const product = await getKatalogByProductCode(formData.kode_produk);
    const pembeli = await getPembeliById(formData.id_pembeli);
    const sum = product.harga_produk * formData.total_pesanan;
    formData.total_harga = sum;
    //mengurangi stok produk dan melakukan update
    const stock = product.stok_produk - formData.total_pesanan;
    await updateStockProduk(stock, formData.kode_produk);
    //generate kode produk
    const primaryKey = orderCodeGenerator(formData.kode_pesanan);
    formData.kode_pesanan = primaryKey;

    const authString = btoa(`${MIDTRANS_SERVER_KEY}`);

    const payload = {
      transaction_details: {
        order_id: primaryKey,
        gross_amount: sum,
      },
      item_details: [
        {
          id: product.kode_produk,
          price: product.harga_produk,
          quantity: formData.total_pesanan,
          name: product.nama_produk,
        },
      ],
      customer_details: {
        first_name: pembeli.username,
        email: pembeli.email,
      },
      callbacks: {
        finish: `${FRONT_END_URL}/order-status?transaction_id=${primaryKey}`,
        error: `${FRONT_END_URL}/order-status?transaction_id=${primaryKey}`,
        pending: `${FRONT_END_URL}/order-status?transaction_id=${primaryKey}`,
      },
    };

    const midtransResponse = await fetch(`${MIDTRANS_APP_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransResponse.json();
    if (midtransResponse.status !== 201) {
      console.log(midtransResponse.status);
      return {
        status: 'error',
        message: 'Failed to create transaction',
        data: midtransData,
        Authorization: `${MIDTRANS_SERVER_KEY}`,
      };
    }

    const order = await insertOrder(formData);

    return {
      id: order.insertId,
      status: 'PENDING_PAYMENT',
      customer_name: pembeli.username,
      customer_email: pembeli.email,
      products: product,
      snap_token: midtransData.token,
      snap_redirect_url: midtransData.redirect_url,
      // check: {
      //   Authorization: `Basic ${authString}`,
      // },
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrders,
};
