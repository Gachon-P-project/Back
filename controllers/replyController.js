const replyModel = require('../models/replyModel');

// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_id를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (req, res) => {
    const dataObj = {
        reply_contents: req.body.reply_contents,
        wrt_date: new Date(),
        user_id: req.params.user,
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