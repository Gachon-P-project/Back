const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

// 토큰 추가
router.post("/", (req, res) => {
    const token = req.body.token;
    const user_no = req.body.user_no;
    const user_major = req.body.user_major;
    const reg_date = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});

    const sql = "INSERT INTO TOKEN SET token=?, user_no=?, reg_date=?, user_major=?;"
    db.query(sql, [token, user_no, reg_date, user_major], (err, reulst) => {
        if(err) {
            console.log(err);
        } else {
            console.log("token added", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.send(reulst);
        }
    })
})

module.exports = router;