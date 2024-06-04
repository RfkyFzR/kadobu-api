const express = require('express');
const routePost = require("./post.js");
const route = express.Router();
const removeFile = require("../helper/fileRemover.js")

route.use("/index", (req, res) => {
    const dateTime = new Date();
    console.log(dateTime.toISOString().slice(0,10));
    
})

route.use("/pengguna", routePost);

route.use("*", (req, res) => {
    res.status(404).send("Page Not Found")
});


module.exports = route;

