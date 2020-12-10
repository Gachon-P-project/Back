const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

// DB 연결
const mysqlConObj = require('./config/mysql');
const db = mysqlConObj.init();
mysqlConObj.open(db);

// USER CREATE - 새 유저 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
router.post("/user/insert", (req, res) => {
    const dataObj = {
        user_id: req.body.user_id,
        user_major: req.body.user_major,
        auth_level: req.body.auth_level
    };

    const sql = "INSERT INTO USER SET ? "

    db.query(sql, dataObj, (err, result) => {
        if(err) {
            console.log("insert err : ", err);
            res.send("유저 등록 실패")
        }
        else {
            console.log("insert result : ", result);
            res.send("유저 등록 성공")
        }
    })
})

// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_id를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
router.post("/reply/insert/:user/:post", (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        wrt_date: new Date(),
        user_id: req.params.user,
        post_no: req.params.post,
        reply_like: 0
    };

    const sql = "INSERT INTO REPLY SET ? "

    db.query(sql, dataObj, (err, result) => {
        if(err) {
            console.log("insert err : ", err);
            res.send("댓글 작성 실패")
        }
        else {
            console.log("insert result : ", result);
            res.send("댓글 작성 성공")
        }
    })
})

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

// BOARD UPDATE - 과목게시판 내 선택한 글 수정
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


// BOARD READ - 과목게시판 특정 단어로 글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
router.get("/select/:subject/search/:word", (req, res) => {
    console.log("select");
    // console.log(req.params);
    const sql = "SELECT * FROM BOARD WHERE subject_name=? AND (post_contents OR post_title LIKE "+ db.escape('%'+req.params.word+'%')+")";
    db.query(sql, req.params.subject, (err, results) => {
        if (err) {
            console.log("select err : ", err)
            res.send("글 조회 실패")
        }
        else {
            console.log("select completed")
            console.log(results)
            res.send(results)
        }
    })
})

// BOARD READ - 과목게시판 내 선택한 글 상세보기
// 클라이언트에서 post_no을 전달하면 해당 튜플을 전송한다.
router.get("/select/:id", (req, res) => {
    const sql = "SELECT * FROM BOARD WHERE post_no = ?";
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            console.log("select err : ", err)
            res.send("상세글 조회 실패")
        }
        else {
            console.log("상세글 조회 성공")
            console.log(results)
            res.send(results)
        }
    })
})

// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_id를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
router.post("/reply/insert/:user/:post", (req, res) => {
    const dataObj = {

// BOARD REPLY DELETE - 과목게시판 내 선택한 글 삭제
// 클라이언트에서 post_no과  전달하면 해당 튜플을 삭제한다.
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


module.exports = router;