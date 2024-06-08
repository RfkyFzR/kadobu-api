const crypto = require('crypto');

const {
  showOrders,
  showOrdersByUserId,
  showOrdersByStoreId,
  insertOrder,
  updateOrderStatusAndPayment,
  showOrdersByUserIdAndStatus,
  findOrderByOrderCode,
  showOrdersByCodeAndStoreId,
  updateOrderStatusAndKeterangan,
} = require('./order.repository.js');
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
async function getOrdersByUserId(userId) {
  try {
    const users = await showOrdersByUserId(userId);
    return users;
  } catch (error) {
    throw error;
  }
}
async function getOrdersByStoreId(storeId) {
  try {
    const users = await showOrdersByStoreId(storeId);
    return users;
  } catch (error) {
    throw error;
  }
}

async function getOrdersByCodeAndStoreId(kode, storeId) {
  try {
    const users = await showOrdersByCodeAndStoreId(kode, storeId);
    if (users) {
      return users[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}
async function getOrdersByUserIdAndStatus(userId, status) {
  try {
    const users = await showOrdersByUserIdAndStatus(userId, status);
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

async function createGuestOrder(formData) {
  try {
    const product = await getKatalogByProductCode(formData.kode_produk);
    if (product.stok_produk <= 0) {
      throw new Error('Stock Kosong!');
    }
    const sum = product.harga_produk * formData.total_pesanan;
    const data = {
      ...formData,
      kode_pesanan: orderCodeGenerator(formData.kode_pesanan),
      total_harga: sum,
    };

    const order = await insertOrder(data);
    return order;
  } catch (error) {
    throw error;
  }
}

async function createOrder(formData) {
  try {
    //mencari katalog dan menghitung total harga
    const product = await getKatalogByProductCode(formData.kode_produk);
    if (product.stok_produk <= 0) {
      throw new Error('Stock Kosong!');
    }
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
        finish: `${FRONT_END_URL}/orders`,
        error: `${FRONT_END_URL}/orders`,
        pending: `${FRONT_END_URL}/orders`,
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

    const order = await insertOrder({
      ...formData,
      snap_token: midtransData.token,
    });

    return {
      id: order.insertId,
      status: 'PENDING',
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

async function editOrderStatusAndPayment(id_order, status, payment_type) {
  try {
    const order = await updateOrderStatusAndPayment(
      id_order,
      status,
      payment_type,
    );
    return order;
  } catch (error) {
    throw error;
  }
}
async function editOrderStatusAndKeterangan(id_order, status, keterangan) {
  try {
    const order = await updateOrderStatusAndKeterangan(
      id_order,
      status,
      keterangan,
    );
    return order;
  } catch (error) {
    throw error;
  }
}

async function getOrderByOrderCode(orderCode) {
  try {
    const results = await findOrderByOrderCode(orderCode);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function updateStatusBasedOnMidtransResponse(transaction_id, data) {
  const foundOrder = await getOrderByOrderCode(transaction_id);
  if (!foundOrder)
    return {
      status: 'error',
      message: 'Order Id not Found',
    };

  const hash = crypto
    .createHash('sha512')
    .update(
      `${transaction_id}${data.status_code}${data.gross_amount}${MIDTRANS_SERVER_KEY}`,
    )
    .digest('hex');
  if (data.signature_key !== hash) {
    return {
      status: 'error',
      message: 'Invalid Signature key',
      realkey: data.signature_key,
      testkey: hash,
    };
  }

  let responseData = null;
  let transactionStatus = data.transaction_status;
  let paymentType = data.payment_type;
  let fraudStatus = data.fraud_status;

  if (transactionStatus == 'capture') {
    if (fraudStatus == 'accept') {
      const transaction = await editOrderStatusAndPayment(
        transaction_id,
        'PAID',
        paymentType,
      );
      responseData = transaction;
    }
  } else if (transactionStatus == 'settlement') {
    const transaction = await editOrderStatusAndPayment(
      transaction_id,
      'PAID',
      paymentType,
    );
    responseData = transaction;
  } else if (
    transactionStatus == 'cancel' ||
    transactionStatus == 'deny' ||
    transactionStatus == 'expire'
  ) {
    const transaction = await editOrderStatusAndPayment(
      transaction_id,
      'CANCELED',
      '',
    );
    responseData = transaction;
  } else if (transactionStatus == 'pending') {
    const transaction = await editOrderStatusAndPayment(
      transaction_id,
      'PENDING',
      '',
    );
    responseData = transaction;
  }

  return {
    status: 'success',
    data: responseData,
  };
}

module.exports = {
  createOrder,
  getOrders,
  // getOrdersByAdminId,
  editOrderStatusAndKeterangan,
  getOrdersByCodeAndStoreId,
  getOrdersByStoreId,
  updateStatusBasedOnMidtransResponse,
  getOrdersByUserId,
  getOrdersByUserIdAndStatus,
  createGuestOrder,
};
