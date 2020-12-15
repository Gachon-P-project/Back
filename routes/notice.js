const express = require('express');
const router = express.Router();
// const replyController = require('./../controllers/noticeController')

const notice = require('./../notice')
// NOTICE READ - 댓글 보기
router.get("/read/:", (req, res) => {
    const pageNum = 0; // 몇번째 페이지
    const pageSize = 10; // 한 페이지에 몇개씩 받을 것인지([공지] 태그 글은 제외)
    const boardType_seq = 159;
    const url = "https://www.gachon.ac.kr/major/bbs.jsp?pageNum="+pageNum+"&pageSize="+pageSize+"&boardType_seq="+boardType_seq+"&approve=&secret=&answer=&branch=&searchopt=&searchword="

    notice(url).then(result => {
        res.send(result);
    })
    
})

module.exports = router;