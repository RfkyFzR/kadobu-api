const express = require('express');
const routePost = require("./post.js");
const route = express.Router();
const bcrypt = require('bcryptjs');

route.use("/index", (req, res) => {
    // res.status(200).send("Hello World")
    var guess = 'admix'
    var stored_hash = '$2a$10$mxC9VZOc0j6EI9E9/fpCousy0NA6mRchqxD18z9W4mTBo3UXUp0nO'
    bcrypt.compare(guess, stored_hash, function(err, data) {
    if (err) throw err
    if (data){
        return res.status(200).json({
            status: true,
            msg: "Password sama!"
        });
    } else {
        return res.status(500).json({
            status: false,
            msg: "Password tidak sama!"
        })
    }
    });
})

route.use("/pengguna", routePost);

route.use("*", (req, res) => {
    res.status(404).send("Page Not Found")
});


module.exports = route;

