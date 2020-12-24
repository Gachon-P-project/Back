const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const noticeController = require('../controllers/noticeController')

// NOTICE READ
router.get("/read/:pageNum/:major", (req, res) => {
    const pageNum = req.params.pageNum; // 몇번째 페이지
    const major = req.params.major;

    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"

    db.query(sql, major, (err, result) => {
        if(err) {
            console.log("select err : ", err);
        }
        else {
            console.log("notice selected");
            const boardType_seq = result[0].major_code;
            const url = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=&searchword="
            
            noticeController.getNoticeList(url, pageNum).then(result => {
                res.send(result);
            })
            
        }
    })
})

router.get("/read/:pageNum/:major/:search", (req, res) => {
    const pageNum = req.params.pageNum; // 몇번째 페이지
    const major = req.params.major;
    const search = req.params.search;

    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"

    db.query(sql, major, (err, result) => {
        if(err) {
            console.log("select err : ", err);
        }
        else {
            console.log("notice selected");
            try {
                const boardType_seq = result[0].major_code;
                const url = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=&searchword="
                
                noticeController.getNoticeList(url, pageNum).then(result => {
                    res.send(result);
                })
            } catch (e) {
                res.send("잘못된 입력값");
            } 
        }
    })
})

router.get("/posting/:major/:board_no", (req, res) => {
    const sql = "SELECT major_code FROM MAJOR WHERE major_name = ?"
    const major = req.params.major;
    
    db.query(sql, major, (err, result) => {
        if(err) {
            console.log("select err : ", err);
        }
        else {
            console.log("notice clicked post");
            try {
                const boardType_seq = result[0].major_code;
                const url = process.env.notice_link+"mode=view&boardType_seq="+String(boardType_seq)+"&board_no="+req.params.board_no+"&approve=&secret=&answer=&branch=&searchopt=&searchword=&pageSize=10&pageNum=0"
                
                noticeController.getClickedPosting(url).then(result => {
                    res.send(result);
                })
            } catch (e) {
                res.send("잘못된 입력값");
            } 
        }
    })
})

module.exports = router;

