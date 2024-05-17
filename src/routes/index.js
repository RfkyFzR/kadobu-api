const express = require('express');
const routePost = require("./post.js");
const route = express.Router();
const removeFile = require("../helper/fileRemover.js")

route.use("/index", (req, res) => {
    removeFile("./src/public/images/1715939943322catto.jpg");
    
})

route.use("/pengguna", routePost);

route.use("*", (req, res) => {
    res.status(404).send("Page Not Found")
});


module.exports = route;

