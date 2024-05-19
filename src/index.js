const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connection = require('./config/database');
const app = express();
const port = 3002;
const route = require('./routes/index.js');
const bodyParser = require('body-parser');
const penggunaController = require('./pengguna/pengguna.controller.js');
const katalogController = require('./katalog/katalog.controller.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(route);
app.use(express.json());
app.use('/product_images', express.static('public/product_images'));
app.use('/penggunas', penggunaController);
app.use('/katalogs', katalogController);
app.listen(port, () => {
  console.log(`Halaman dimuat pada http://localhost:${port}`);
});

module.exports = connection;
