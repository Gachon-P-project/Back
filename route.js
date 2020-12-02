const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const sequelize = require('sequelize');

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
        major_name: "컴퓨터공학과",
        subject_name: "피프로젝트",
        professor_name: "황희정",
        user_id: "jy11290"
    };

    const sql = "INSERT INTO BOARD SET ? "

    db.query(sql, dataObj, (err, result) => {
        if(err) console.log("insert err : ", err);
        else console.log("insert result : ", result);
    })
});

// BOARD SELECT
router.get("/select", (req, res) => {
    const sql = "SELECT * FROM BOARD;"
    db.query(sql, (err, results) => {
        console.log("results: ", results);
    })
})


module.exports = router;