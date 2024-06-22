const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connection = require('./config/database');
// const multer = require('multer');

dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT;
// const route = require('./routes/index.js');
const bodyParser = require('body-parser');
const pembeliController = require('./pembeli/pembeli.controller.js');
const katalogController = require('./katalog/katalog.controller.js');
const tokoController = require('./toko/toko.controller.js');
const penjualController = require('./penjual/penjual.controller.js');
const inviteStaffController = require('./invite-staff/invite-staff.controller.js');
const signUpPembeliController = require('./signup-pembeli/signup-pembeli.controller.js');
const signUpPenjualController = require('./signup-penjual/signup-penjual.controller.js');
const signInPembeliController = require('./signin-pembeli/signin-pembeli.controller.js');
const orderController = require('./order/order.controller.js');
const commentController = require('./comment/comment.controller.js');
const orderNotification = require('./order/notification.controller');
const statisticsController = require('./statistik/statistik.controller.js');
const wishlistController = require('./wishlist/wishlist.controller.js');
const keranjangController = require('./keranjang/keranjang.controller.js');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
// app.use(multer().array())
// app.use(route);
app.use(express.json());

app.use('/signup-pembeli', signUpPembeliController);
app.use('/signup-penjual', signUpPenjualController);
app.use('/signin-pembeli', signInPembeliController);
app.use('/penjual', penjualController);
app.use('/pembeli', pembeliController);
app.use('/katalogs', katalogController);
app.use('/toko', tokoController);
app.use('/invite-staff', inviteStaffController);
app.use('/order', orderController);
app.use('/statistik', statisticsController);
app.use('/wishlist', wishlistController);
app.use('/keranjang', keranjangController);
app.use('/comment', commentController);
app.use('/order/notification', orderNotification);
app.use('/wishlist', wishlistController);
app.use('/keranjang', keranjangController);


app.listen(port, () => {
  console.log(`Halaman dimuat pada http://localhost:${port}`);
});

module.exports = connection;
