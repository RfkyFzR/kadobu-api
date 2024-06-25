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
  findOrderById,
} = require('./order.repository.js');
const midtransClient = require('midtrans-client');
const {
  findKatalogByProductCode,
  updateStockProduk,
  decrementStockProduk,
} = require('../katalog/katalog.repository.js');
const { findPenjualById } = require('../penjual/penjual.repository.js');
const orderCodeGenerator = require('../helper/OrderCodeGenerator.js');
const { getPembeliById } = require('../pembeli/pembeli.service');

const { MIDTRANS_APP_URL, MIDTRANS_SERVER_KEY } = require('../config/midtrans');
const { FRONT_END_URL } = require('../config/frontend');
const {
  getKeranjangById,
  getKeranjangByIdPembeli,
  createKeranjang,
} = require('../keranjang/keranjang.service.js');
const {
  updateIdOrderKeranjangById,
  getKeranjangByOrderId,
  updateStatusAndKeteranganKeranjang,
} = require('../keranjang/keranjang.repository.js');
async function getOrders(kode_pesanan) {
  try {
    const users = await showOrders(kode_pesanan);
    return users;
  } catch (error) {
    throw error;
  }
}
async function getOrdersByUserId(userId, find) {
  try {
    let results = [];
    const orders = await showOrdersByUserId(userId, find);
    for (const order of orders) {
      const keranjang = await getKeranjangByOrderId(order.kode_pesanan);
      const result = {
        ...order,
        keranjang,
      };
      results.push(result);
    }
    return results;
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

async function getOrderById(id) {
  try {
    const users = await findOrderById(id);
    if (users) {
      return users[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
}

async function getOrdersByUserIdAndStatus(userId, status, find) {
  try {
    const users = await showOrdersByUserIdAndStatus(userId, status, find);
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

async function createGuestOrder(kode_produk, total_pesanan, catatan) {
  try {
    const katalog = await getKatalogByProductCode(kode_produk);
    const total_harga = total_pesanan * katalog.harga_produk;
    await decrementStockProduk(total_pesanan, kode_produk);

    const { insertId } = await insertOrder({
      kode_pesanan: orderCodeGenerator(),
      jenis_pembayaran: 'bayar_ditempat',
      status: 'PAID',
      total_harga,
      id_pembeli: 'kadobu-guest',
      snap_token: '',
    });
    let formData = {
      id_pembeli: 'kadobu-guest',
      id_order: insertId,
      kode_produk: kode_produk,
      jumlah_pesanan: total_pesanan,
      total_harga: null,
      catatan: catatan,
      status_keranjang: 'PAID',
      keterangan_keranjang: 'Dibayarkan Langsung',
    };
    const keranjang = await createKeranjang(formData);

    return keranjang;
  } catch (error) {
    throw error;
  }
}

async function createOrder(formData) {
  try {
    //mencari katalog dan menghitung total harga
    let item_details = [];
    let sum = 0;
    formData.list_keranjang.map(async (keranjang) => {
      const data = await getKeranjangById(keranjang.id_keranjang);
      item_details.push({
        id: data.id_keranjang,
        price: data.total_harga / data.jumlah_pesanan,
        quantity: data.jumlah_pesanan,
        name: data.nama_produk,
      });
      sum += data.total_harga;
    });
    const pembeli = await getPembeliById(formData.id_pembeli);
    formData.total_harga = sum;
    //mengurangi stok produk dan melakukan update

    //generate kode produk
    const primaryKey = orderCodeGenerator(formData.kode_pesanan);
    formData.kode_pesanan = primaryKey;

    const authString = btoa(`${MIDTRANS_SERVER_KEY}`);

    const payload = {
      transaction_details: {
        order_id: primaryKey,
        gross_amount: sum,
      },
      item_details,
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
    delete formData.list_keranjang;

    const order = await insertOrder({
      ...formData,
      snap_token: midtransData.token,
    });

    item_details.map(async (keranjang) => {
      await updateIdOrderKeranjangById(keranjang.id, order.insertId);
    });

    return {
      id: order.insertId,
      status: 'PENDING',
      customer_name: pembeli.username,
      customer_email: pembeli.email,
      item_details,
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

async function editOrderStatusAndPayment(
  id_order,
  status,
  keterangan,
  payment_type,
) {
  try {
    const order = await updateOrderStatusAndPayment(
      id_order,
      status,
      payment_type,
    );
    const results = [];
    const keranjangs = await getKeranjangByOrderId(id_order);
    keranjangs.map(async (keranjang) => {
      const result = await updateStatusAndKeteranganKeranjang(
        keranjang.id_keranjang,
        status,
        keterangan,
      );
      results.push(result);
    });
    return { resultsOrder: order, resultsKeranjang: results, keranjangs };
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
        'Pesanan Sudah Dibayarkan',
        paymentType,
      );
      responseData = transaction;
    }
  } else if (transactionStatus == 'settlement') {
    const transaction = await editOrderStatusAndPayment(
      transaction_id,
      'PAID',
      'Pesanan Sudah Dibayarkan',
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
      'Pesanan Gagal Dibayarkan',
      '',
    );
    responseData = transaction;
  } else if (transactionStatus == 'pending') {
    const transaction = await editOrderStatusAndPayment(
      transaction_id,
      'PENDING',
      'Pesanan Belum Dibayarkan',
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
  getOrderById,
};
