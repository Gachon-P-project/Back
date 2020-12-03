const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

// DB 연결
const mysqlConObj = require('./config/mysql');
const db = mysqlConObj.init();
mysqlConObj.open(db);

// BOARD CREATE - 과목게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, major_name, subject_name, professor_name, user_id를 전달
router.post("/insert", (req, res) => {
    const dataObj = {
        post_title: req.body.post_title,
        post_contents: req.body.post_contents,
        post_like: 0,
        wrt_date: new Date(),
        view_cnt: 1,
        reply_yn: req.body.reply_yn,
        major_name: req.body.major_name,
        subject_name: req.body.subject_name,
        professor_name: req.body.professor_name,
        user_id: req.body.user_id
    };

    const sql = "INSERT INTO BOARD SET ? "

    db.query(sql, dataObj, (err, result) => {
        if(err) {
            console.log("insert err : ", err);
            res.send("글 작성 실패")
        }
        else {
            console.log("insert result : ", result);
            res.send("글 작성 성공")
        }
    })
});

// BOARD READ - 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
router.get("/select/:subject/:professor", (req, res) => {
    console.log("select");
    console.log(req.params);
    
    const sql = "SELECT * FROM BOARD WHERE subject_name=? AND professor_name=?";
    db.query(sql, [req.params.subject, req.params.professor], (err, results) => {
        if (err) {
            console.log("select err : ", err)
            res.send("글 조회 실패")
        }
        else {
            console.log("select completed")
            res.send(results)
        }
    })
})

// BOARD UPDATE - 과목게시판 내 석택한 글 수정
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
router.post("/edit/:id", (req, res) => {
    const sql = "UPDATE BOARD SET post_title = ?, post_contents = ? where post_no = ?";
    db.query(sql, [req.body.post_title, req.body.post_contents, req.params.id], (err) => {
        if (err) {
            console.log("update err : ", err);
        }
        else {
            console.log("글 수정 성공");
            res.send("글 수정 성공")
        }
    })
})

// BOARD DELETE - 과목게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
router.get("/delete/:id", (req, res) => {
    const sql = "DELETE FROM BOARD WHERE post_no = ?";
    db.query(sql, req.params.id, (err) => {
        if (err) {
            console.log("delete err : ", err);
        }
        else {
            console.log("글 삭제 성공");
            res.send("글 삭제 성공")
        }
    })
})



// BOARD SELECT - BOARD 테이블 전체 조회(테스트용)
router.get("/select", (req, res) => {
    const sql = "SELECT * FROM BOARD"
    db.query(sql, (err, results) => {
        if (err) {
            console.log("select err : ", err)
            res.send("글 조회 실패")
        }
        else {
            console.log("select completed")
            res.send(results)
        }
    })
})



module.exports = router;