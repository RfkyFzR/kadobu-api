const express = require('express');
const cookieParser = require('cookie-parser');
const connection = require('./config/database');
// const multer = require('multer');
const app = express();
const port = 3000;
// const route = require('./routes/index.js');
const bodyParser = require('body-parser');
const pembeliController = require('./pembeli/pembeli.controller.js');
const katalogController = require('./katalog/katalog.controller.js');
const tokoController = require('./toko/toko.controller.js');
const penjualController = require('./penjual/penjual.controller.js');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
// app.use(multer().array())
// app.use(route);
app.use(express.json());

app.use("/penjual", penjualController);
app.use("/pembeli", pembeliController);
app.use("/katalogs", katalogController);
app.use("/toko", tokoController);


app.listen(port, () => {
    console.log(`Halaman dimuat pada http://localhost:${port}`)
})

module.exports = connection;

