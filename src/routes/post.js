const express = require('express');
const routePost = express.Router();
const {body, validationResult} = require('express-validator');
const hashPassword = require("../helper/hash.js")

routePost.get("/data", (req, res) => {
    connection.query('SELECT * FROM pengguna ORDER BY id desc', function (err, rows) {
        if  (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: 'List Data Pengguna',
                data: rows
            });
        };
    })
});

routePost.post("/tambah", [
    body('username').notEmpty(),
    body('password').notEmpty(),
    body('email').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors : errors.array()
        });
    }

    const encryptPassword = hashPassword(req.body.password);
    let formData = {
        username: req.body.username,
        password: encryptPassword,
        email: req.body.email,
    }

    connection.query('INSERT INTO pengguna SET ?', formData, function (err, rows) {
        if (err){
            if (err.errno === 1062){
                return res.status(400).json({
                    status: false,
                    message: 'Username atau Email sudah digunakan!'
                });
            }
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                error: err
            });
        }
        else {
            return res.status(201).json({
                status: false,
                message: 'Data berhasil ditambahkan',
                data: rows,
                username: req.body.username,
                password: encryptPassword,
                email: req.body.email,
            })
        }
    })
    
})

module.exports = routePost;