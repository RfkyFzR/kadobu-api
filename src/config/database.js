const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_buket'
});

connection.connect(function(error){
    if(!!error){
        console.log(error);
    }
    else {
        console.log("Database Terhubung");
    }
})

module.exports = connection;