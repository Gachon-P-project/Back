const scrapModel = require('../models/scrapModel');


// SCRAP CREATE - 게시글 스크랩/스크랩 취소
// 클라이언트에서 post_no과 user_no를 파라미터로 전달
exports.createScrap = (req, res) => {
    let post_no = req.params.post;
    let user_no = req.params.userNo;
    
    scrapModel.createScrap(post_no, user_no, (result) => {
        if (result) {
            console.log("scrap insert completed")
            res.send(result)
        }
    })
}

// SCRAP CREATE - 게시글 스크랩/스크랩 취소
// 클라이언트에서 post_no과 user_no를 파라미터로 전달
exports.readScrap = (req, res) => {
    let user_no = req.params.userNo;
    
    scrapModel.readScrap(user_no, (result) => {
        if (result) {
            console.log("scrap read completed")
            res.send(result)
        }
    })
}