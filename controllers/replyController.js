const replyModel = require('../models/replyModel');

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

// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_no를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
// bundle_id 값 입력
exports.createReply = (req, res) => {
    let reply_contents = req.body.reply_contents;
    let user_no = req.params.user;
    let post_no = req.params.post;
    let wrt_date = new Date();
    
    replyModel.createReply(reply_contents, user_no, post_no, wrt_date, (result) => {
        if (result) {
            console.log("reply insert completed")
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


// REPLY DELETE - 댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜플의 을 삭제한다.
exports.deleteReply = (req, res) => {

    let reply_no = req.params.id;
    
    replyModel.deleteReply(reply_no, (result) => {
        if (result) {
            console.log("reply delete completed")
            res.send(result)
        }
    })
}



// REREPLY CREATE - 대댓글 작성 (수정중)
// router.get("/rereply/insert/:user/:post", replyController.createReReply)

// 클라이언트에서 post_no과 user_no를 파라미터로 전달한다.
// 작성할 대댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReReply = (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        user_id: req.params.user,
        post_no: req.params.post,
        wrt_date: new Date(),
        
    };
    
    replyModel.createReply(dataObj, (result) => {
        if (result) {
            console.log("reply insert completed")
            res.send(result)
        }
    })
}


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



// REPLY READ - 해당 게시글의 댓글 보기
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readReply = (req, res) => {
    let post_no = req.params.post;
    
    replyModel.readReply(post_no, (result) => {
        if (result) {
            console.log("reply select completed")
            res.send(result)
        }
    })
}


