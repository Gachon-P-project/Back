const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const noticesController = require('../controllers/noticesController')

// 공지사항 조회
router.get("/list/:page_num/:major", (req, res) => {
    const pageNum = req.params.page_num;
    const major = req.params.major;

    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"
    try {
        db.query(sql, major, (err, result) => {
            if(err) {
                console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            }
            else {
                console.log("notice selected", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                try {
                    const boardType_seq = result[0].major_code;

                    const url = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=&searchword="
                
                    noticesController.getNoticeList(url, pageNum).then(result => {
                    res.send(result);
                })
                } catch (e) {
                    console.log(req.params.major, "공지사항 조회 오류");
                }
                
                
            }
        })
    } catch (e) {
        console.log(req.params.major, "공지사항 조회 오류");
    }
    
})

// 공지사항 검색
router.get("/list/:page_num/:major/:search", (req, res) => {
    const pageNum = req.params.page_num;
    const major = req.params.major;
    const search = req.params.search;

    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"

    try {
        db.query(sql, major, (err, result) => {
            if(err) {
                console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            }
            else {
                console.log("notice selected", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                try {
                    const boardType_seq = result[0].major_code;
                    const url = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=title&searchword="+encodeURI(search)
    
                    noticesController.getNoticeSearchList(url, pageNum).then(result => {
                        res.send(result);
                    })
                } catch (e) {
                    res.send("잘못된 입력값");
                } 
            }
        })
    } catch (e) {
        console.log(req.params.major, "공지사항 검색 오류");
    }
    
})

// 공지사항 게시글 선택
router.get("/posting/:major/:board_no", (req, res) => {
    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"
    const major = req.params.major;
    
    try {
        db.query(sql, major, (err, result) => {
            if(err) {
                console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            }
            else {
                console.log("notice clicked post", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                try {
                    const boardType_seq = result[0].major_code;
                    const url = process.env.notice_link+"mode=view&boardType_seq="+String(boardType_seq)+"&board_no="+req.params.board_no+"&approve=&secret=&answer=&branch=&searchopt=&searchword=&pageSize=10&pageNum=0"
                    
                    noticesController.getClickedPosting(url).then(result => {
                        res.send(result);
                    })
                } catch (e) {
                    res.send("잘못된 입력값", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                } 
            }
        })
    } catch (e) {
        console.log(req.params.major, "공지사항 게시글 선택 오류");
    }
    
})

// 공지사항 게시글 선택_URL
router.get("/posting/url/:major/:board_no", (req, res) => {
    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"
    const major = req.params.major;

    try {
        db.query(sql, major, (err, result) => {
            if(err) {
                console.log("select err : ", err);
            }
            else {
                console.log("notice clicked post - url");
                try {
                    const boardType_seq = result[0].major_code;
                    const url = process.env.notice_link+"mode=view&boardType_seq="+String(boardType_seq)+"&board_no="+req.params.board_no+"&approve=&secret=&answer=&branch=&searchopt=&searchword=&pageSize=10&pageNum=0"
                    
                    res.send(url);
                } catch (e) {
                    res.send("잘못된 입력값", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                } 
            }
        })
    } catch (e) {
        console.log(req.params.major, "공지사항 게시글 선택_URL 오류");
    }
    
})

module.exports = router;

