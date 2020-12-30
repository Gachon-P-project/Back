const express = require('express');
const router = express.Router();
const replyController = require('./../controllers/replyController')

// REPLY CREATE - 새 댓글 작성
router.post("/insert/:user/:post", replyController.createReply)

// REREPLY CREATE - 대댓글 작성
router.post("/insert/rereply/:userNo/:postNo/:replyNo", replyController.createReReply)

// REPLY READ - 댓글 보기
router.get("/read/:post", replyController.readReply)

// REPLY UPDATE - 댓글 수정 (불가)
// router.put("/update/:id", replyController.updateReply)

// REREPLY UPDATE - 대댓글 수정 (불가)
//router.put("/update/rereply/:id", replyController.updateReReply)

// REPLY DELETE - 댓글 삭제
router.delete("/delete/:bundleId", replyController.deleteReply)

// REREPLY DELETE - 대댓글 삭제
router.delete("/delete/rereply/:replyNo", replyController.deleteRereply)

// REPLY READ COUNT - 댓글 수 카운트
// router.get("/read/count/:post", replyController.readCountReply)

module.exports = router;