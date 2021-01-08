const freeBoardReplyModel = require('../models/freeBoardReplyModel');

// FREE BOARD REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_no를 파라미터로, 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (req, res) => {
    let reply_contents = req.body.reply_contents;
    let user_no = req.params.user;
    let post_no = req.params.post;
    let wrt_date = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
    
    freeBoardReplyModel.createReply(reply_contents, user_no, post_no, wrt_date, (result) => {
        if (result) {
            console.log("reply insert completed")
            res.send(result)
        }
    })
}

// /REREPLY CREATE - 대댓글 작성
// router.get("/free/insert/rereply/:userNo/:postNo/:replyNo", replyController.createReReply)
// 클라이언트에서 user_no, post_no과 부모 댓글의 reply_no를 파라미터로 전달한다.
// 작성할 대댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReReply = (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        user_no: req.params.userNo,
        post_no: req.params.postNo,
        wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
        depth: 1,
        bundle_id: req.params.replyNo 
    }
    
    freeBoardReplyModel.createReReply(dataObj, (result) => {
        if (result) {
            console.log("rereply insert completed")
            res.send(result)
        }
    })
}

// router.get("/free/read/:post", replyController.readReply)
// REPLY READ - 해당 게시글의 댓글 보기
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readReply = (req, res) => {
    let post_no = req.params.post;
    
    freeBoardReplyModel.readReply(post_no, (result) => {
        if (result) {
            console.log("reply select completed")
            res.send(result)
        }
    })
}

// REPLY DELETE - 댓글 삭제
// 클라이언트에서 bundleId를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
//router.get("/free/delete/:bundleId", replyController.countBundle)
exports.deleteReply = (req, res) => {
    let bundleId = req.params.bundleId
    
    freeBoardReplyModel.deleteReply(bundleId, (result) => {
        if (result) {
            console.log("reply delete completed")
            res.send(result)
        }
    })
}

// REREPLY DELETE - 대댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
exports.deleteRereply = (req, res) => {
    let reply_no = req.params.replyNo;

    freeBoardReplyModel.deleteRereply(reply_no, (result) => {
        if (result) {
            console.log("rereply delete completed")
            res.send(result)
        }
    })
}