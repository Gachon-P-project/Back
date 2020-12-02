const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

// DB 연결
const mysqlConObj = require('./config/mysql');
const db = mysqlConObj.init();
mysqlConObj.open(db);

// BOARD INSERT
router.post("/insert", (req, res) => {
    const dataObj = {
        post_title: "글 작성 테스트",
        post_contents: "글 작성 테스트 글 내용",
        wrt_date: new Date(),
        view_cnt: 1,
        reply_yn: "Y",
        major_name: "소프트웨어과",
        subject_name: "소프트웨어개론",
        professor_name: "홍길동",
        user_id: "jy11290"
    };
    console.log(req.body.post_title);
    const sql = "INSERT INTO BOARD SET ? "

    // db.query(sql, dataObj, (err, result) => {
    //     if(err) console.log("insert err : ", err);
    //     else console.log("insert result : ", result);
    // })
});

// BOARD SELECT
router.get("/select/:subject/:professor", (req, res) => {
    console.log("select");
    console.log(req.params);
    
    const sql = "SELECT * FROM BOARD WHERE subject_name=? AND professor_name=?";
    db.query(sql, [req.params.subject, req.params.professor], (err, results) => {
        if (err) {
            console.log("select err : ", err)
        }
        else {
            console.log("select completed")
            res.send(results)
        }
    })
})


module.exports = router;