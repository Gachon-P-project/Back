const express = require('express');
const router = express.Router();
const replyController = require('./../controllers/replyController')

// REPLY CREATE - 새 댓글 작성
router.post("/insert/:user/:post", replyController.createReply)

// REPLY UPDATE - 댓글 수정 (불가)
// router.post("/update/:id", replyController.updateReply)

// REPLY DELETE - 댓글 삭제
router.delete("/delete/:id", replyController.deleteReply)

// REPLY READ - 댓글 보기
router.get("/read/:post", replyController.readReply)

// REPLY READ COUNT - 댓글 수 카운트
// router.get("/read/count/:post", replyController.readCountReply)


// REREPLY CREATE - 대댓글 작성 (수정중)
router.get("/rereply/insert/:userNo/:postNo/:replyNo", replyController.createReReply)

<<<<<<< HEAD
// REREPLY UPDATE - 대댓글 수정 (불가)
//router.get("/rereply/update/:user/:post", replyController.updateReReply)
=======
// REREPLY CREATE - 대댓글 작성
router.get("/rereply/insert/:user/:post", replyController.createReReply)

// REREPLY UPDATE - 대댓글 수정
router.get("/rereply/update/:user/:post", replyController.updateReReply)

// // REREPLY DELETE - 대댓글 삭제
// router.delete("/rereply/delete/:user/:post", replyController.deleteReReply)

// // REREPLY READ - 대댓글 보기
// router.get("/rereply/read/:user/:post", replyController.readReReply)

>>>>>>> 44eab2beb08edb966a746875ecdcb35ae9e948b0

module.exports = router;