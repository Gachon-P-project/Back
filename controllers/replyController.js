const replyModel = require('../models/replyModel');

// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_id를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        wrt_date: new Date(),
        user_no: req.params.user,
        post_no: req.params.post,
        reply_like: 0
    };
    
    replyModel.createReply(dataObj, (result) => {
        if (result) {
            console.log("reply insert completed")
            res.send(result)
        }
    })
}


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


// REPLY DELETE - 댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜블을 삭제한다.
exports.deleteReply = (req, res) => {
    let reply_no = req.params.id;
    
    replyModel.deleteReply(reply_no, (result) => {
        if (result) {
            console.log("reply delete completed")
            res.send(result)
        }
    })
}

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


// REPLY COUNT READ - 해당 게시글의 댓글 개수
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플의 개수 전송한다.
// exports.readCountReply = (req, res) => {
//     let post_no = req.params.post;
    
//     replyModel.readCountReply(post_no, (result) => {
//         if (result) {
//             console.log("reply select completed")
//             res.send(result)
//         }
//     })
// }