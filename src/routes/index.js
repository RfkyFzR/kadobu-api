const express = require('express');
const routePost = require("./post.js");
const route = express.Router();
const bcrypt = require('bcryptjs');

route.use("/index", (req, res) => {
    // res.status(200).send("Hello World")
    var guess = 'admin'
    var stored_hash = '$2a$10$1WPPmPissD4yD9jq8XdjTO.F8/v7bKP.NIOv5coymukE0ALYDReOG'
    const result = bcrypt.compareSync(guess, stored_hash)
    res.send(result);
    // if (err) throw err
    // if (data){
    //     return res.status(200).json({
    //         status: true,
    //         msg: "Password sama!"
    //     });
    // } else {
    //     return res.status(500).json({
    //         status: false,
    //         msg: "Password tidak sama!"
    //     })
    // }
    // });
})

route.use("/pengguna", routePost);

route.use("*", (req, res) => {
    res.status(404).send("Page Not Found")
});


module.exports = route;

