const freeBoardReplyModel = require('../models/freeBoardReplyModel');

// 댓글 작성
// 클라이언트에서 post_no과 user_no를 파라미터로, 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (req, res) => {
    let reply_contents = req.body.reply_contents;
    let user_no = req.body.user_no;
    let post_no = req.body.post_no;
    let wrt_date = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
    
    freeBoardReplyModel.createReply(reply_contents, user_no, post_no, wrt_date, (result) => {
        if (result) {
            console.log("reply insert completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 대댓글 작성
// router.get("/insert/rereply/:userNo/:postNo/:replyNo", replyController.createReReply)
// 클라이언트에서 user_no, post_no과 부모 댓글의 reply_no를 파라미터로 전달한다.
// 작성할 대댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReReply = (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        user_no: req.body.user_no,
        post_no: req.body.post_no,
        wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
        depth: 1,
        bundle_id: req.body.reply_no,
        board_flag: 1
    }
    
    freeBoardReplyModel.createReReply(dataObj, (result) => {
        if (result) {
            console.log("rereply insert completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 전체 댓글 조회
// router.get("/read/:post", replyController.readReply)
// REPLY READ - 해당 게시글의 댓글 보기
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readReply = (req, res) => {
    let post_no = req.params.post_no;
    
    freeBoardReplyModel.readReply(post_no, (result) => {
        if (result) {
            console.log("reply select completed")
            res.send(result)
        }
    })
}

// 댓글 삭제
// 클라이언트에서 bundleId를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
//router.get("/delete/:bundleId", replyController.countBundle)
exports.deleteReply = (req, res) => {
    let bundleId = req.params.bundle_id
    
    freeBoardReplyModel.deleteReply(bundleId, (result) => {
        if (result) {
            console.log("reply delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 대댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
exports.deleteRereply = (req, res) => {
    let reply_no = req.params.reply_no;

    freeBoardReplyModel.deleteRereply(reply_no, (result) => {
        if (result) {
            console.log("rereply delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}