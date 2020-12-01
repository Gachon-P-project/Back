const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
    const test_code = "GA001"
    const test_name = "쿼리테스트다"

    con.query('insert into TEST values (?,?)', [test_code, test_name], () => {
        console.log("insert 완료");
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