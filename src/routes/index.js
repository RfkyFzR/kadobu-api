const express = require('express');
const routePost = require("./post.js");
const route = express.Router();
const removeFile = require("../helper/fileRemover.js")
const wbm = require('wbm');

route.use("/index", (req, res) => {
    wbm.start().then(async () => {
        const phones = ['082133107074'];
        const message = 'GT Pepek';
        await wbm.send(phones, message);
        await wbm.end();
    }).catch(err => console.log(err));
})

route.use("/pengguna", routePost);

route.use("*", (req, res) => {
    res.status(404).send("Page Not Found")
});


module.exports = route;

