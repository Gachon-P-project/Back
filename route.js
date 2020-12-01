const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

router.use(bodyParser.urlencoded({ extended: false }));

// INSERT
router.get("/insert", (req, res) => {
    const test_code = "GA001"
    const test_name = "쿼리테스트다"

    con.query('insert into TEST values (?,?)', [test_code, test_name], () => {
        console.log("insert 완료");
    })
})

// SELECT
router.get("/select", (req, res) => {
    con.query('select * from TEST', (err, result) => {
        res.send(result);
    })
})

const con = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database 
});

con.connect(err => {
    if(err) console.log(err);
    else console.log("MySQL Connected");
})

module.exports = router;