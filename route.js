const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
    // con.connect(err => {
    //     if(err) console.log(err);
    //     else console.log("successfully!");
    // })
    res.send("Connect Test")
})

const con = mysql.createConnection({
    host: 'localhost',
    port: '53306',
    user: 'root',
    password: '123qweasd',
    database: 'moga_db' 
});

con.connect(err => {
    if(err) console.log(err);
    else console.log("successfully!");
})

module.exports = router;