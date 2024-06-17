const {
  showOrders,
  insertOrder,
  updateOrderStatus,
  findOrderById,
} = require("./order.repository.js");
const midtransClient = require("midtrans-client");
const {
  findKatalogByProductCode,
  updateStockProduk,
} = require("../katalog/katalog.repository.js");
const {
  findPenjualById,
} = require ("../penjual/penjual.repository.js")
const orderCodeGenerator = require("../helper/OrderCodeGenerator.js");
const { getPembeliById } = require("../pembeli/pembeli.service");

const { MIDTRANS_APP_URL, MIDTRANS_SERVER_KEY } = require("../config/midtrans");
const { FRONT_END_URL } = require("../config/frontend");
const { sendEmails } = require('../helper/sendEmails.js');

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

async function getPenjualById(id_Penjual) {
  try {
    const results = await findPenjualById(id_Penjual);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function createOrder(formData, id_penjual) {
  try {
    //mencari katalog dan menghitung total harga
    const product = await getKatalogByProductCode(formData.kode_produk);
    if (product.stok_produk <= 0) {
      throw new Error("Stock Kosong!");
    }
    const pembeli = await getPembeliById(formData.id_pembeli);
    const sum = product.harga_produk * formData.total_pesanan;
    formData.total_harga = sum;
    //Menambah total penjualan
    formData.total_penjualan = formData.total_pesanan
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransResponse.json();
    if (midtransResponse.status !== 201) {
      console.log(midtransResponse.status);
      return {
        status: "error",
        message: "Failed to create transaction",
        data: midtransData,
        Authorization: `${MIDTRANS_SERVER_KEY}`,
      };
    }
    //mengirim notif ke email bahwa terdapat order masuk
    const penjual = await getPenjualById(id_penjual);
    sendEmails(penjual.email, pembeli.username, product.nama_produk)

    //insert db pada tbl_order
    const order = await insertOrder(formData);

    return {
      id: order.insertId,
      status: "PENDING_PAYMENT",
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

async function getOrderById(id_order) {
  try {
    const results = await findOrderById(id_order);
    if (results.length > 0) {
      return results[0];
    }
    throw new Error('Order Tidak Ditemukan');
  } catch (error) {
    throw error;
  }
}

async function editOrderStatus(id_order, status) {
  try {
    const order = await updateOrderStatus(id_order, status);

    if (status === "Accepted"){
      //mengurangi stok produk apabila statusnya sudah accept dengan cara update
      const order = await getOrderById(id_order)
      const product = await getKatalogByProductCode(order.kode_produk);
      const stock = product.stok_produk - order.total_pesanan
      console.log(product.stok_produk);
      await updateStockProduk(stock, order.kode_produk);
      return order;
    }
    return order;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrders,
  editOrderStatus,
  getOrderById,
};
