const repliesModel = require('../models/repliesModel');


// 댓글 작성
// 클라이언트에서 post_no과 user_no를 파라미터로, 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (req, res) => {
    let reply_contents = req.body.reply_contents;
    let user_no = req.body.user_no;
    let post_no = req.body.post_no;
    let wrt_date = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
    
    repliesModel.createReply(reply_contents, user_no, post_no, wrt_date, (result) => {
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
        bundle_id: req.body.reply_no 
    }
    
    repliesModel.createReReply(dataObj, (result) => {
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
    
    repliesModel.readReply(post_no, (result) => {
        if (result) {
            console.log("reply select completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

/* 댓글 수정 불가
// REPLY UPDATE - 댓글 수정   
// 클라이언트에서 reply_no을 파라미터로 전달하면 해당 튜블의 reply_contents를 수정한다.
// 수정할 댓글 내용은 body를 통해 전달된다.
exports.updateReply = (req, res) => {
    let reply_no = req.params.id;
    let reply_contents = req.body.reply_contents;
    
    replyModel.updateReply(reply_no, reply_contents, (result) => {
        if (result) {
            console.log("reply update completed")
            res.send(result)
        }
    })
}
*/

/* 대댓글 수정 불가
// REREPLY UPDATE - 대댓글 수정 
// router.get("/rereply/update/:user/:post", replyController.updateReReply)
exports.updateReReply = (req, res) => {
    let reply_no = req.params.id;
    let reply_contents = req.body.reply_contents;
    
    replyModel.updateReReply(reply_no, reply_contents, (result) => {
        if (result) {
            console.log("reply update completed")
            res.send(result)
        }
    })
}
*/

// 댓글 삭제
// 클라이언트에서 bundleId를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
//router.get("/delete/:bundleId", replyController.countBundle)
exports.deleteReply = (req, res) => {
    let bundleId = req.body.bundle_id
    
    repliesModel.deleteReply(bundleId, (result) => {
        if (result) {
            console.log("reply delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 대댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
exports.deleteRereply = (req, res) => {
    let reply_no = req.body.reply_no;

    repliesModel.deleteRereply(reply_no, (result) => {
        if (result) {
            console.log("rereply delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

/* 게시글 리스트 출력에 포함
REPLY COUNT READ - 해당 게시글의 댓글 개수
클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플의 개수 전송한다.
exports.readCountReply = (req, res) => {
    let post_no = req.params.post;
    
    replyModel.readCountReply(post_no, (result) => {
        if (result) {
            console.log("reply select completed")
            res.send(result)
        }
    })
}
*/