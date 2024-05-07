const express = require('express');
const connection = require('./config/database');
const app = express();
const port = 3000;
const route = require('./routes/index.js');
const bodyParser = require('body-parser');
const penggunaController = require('./pengguna/pengguna.controller.js');
const katalogController = require('./katalog/katalog.controller.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use(route);
app.use(express.json());
app.use("/penggunas", penggunaController);
app.use("/katalogs", katalogController)
app.listen(port, () => {
    console.log(`Halaman dimuat pada http://localhost:${port}`)
})

module.exports = connection;

