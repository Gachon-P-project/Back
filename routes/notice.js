const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const noticeController = require('../controllers/noticeController')

// NOTICE READ - 댓글 보기
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
            const url = "https://www.gachon.ac.kr/major/bbs.jsp?pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=&searchword="
            
            noticeController(url).then(result => {
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
            const boardType_seq = result[0].major_code;
            const url = "https://www.gachon.ac.kr/major/bbs.jsp?pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(boardType_seq)+"&approve=&secret=&answer=&branch=&searchopt=title&searchword="+encodeURI(search)
            
            console.log(url);
            noticeController(url).then(result => {
                res.send(result);
            })
            
        }
    })
})

module.exports = router;

