const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

router.post("/add", (req, res) => {
    const token = req.body.token;
    const user_no = req.body.number;
    const reg_date =  new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});

    const sql = "INSERT INTO TOKEN SET token=?, user_no=?, reg_date=?;"
    db.query(sql, [token, user_no, reg_date], (err, reulst) => {
        if(err) {
            console.log(err);
        } else {
            console.log("token added");
            res.send(reulst);
        }
    })
})

module.exports = router;