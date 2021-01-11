const express = require('express');
const router = express.Router();
const repliesController = require('../controllers/repliesController')
const freeBoardReplyController = require('./../controllers/freeBoardReplyController')
const majorBoardReplyController = require('./../controllers/majorBoardReplyController')

/* 수업 게시판 */
// 댓글 작성
router.post("/subject", repliesController.createReply)

// 대댓글 작성
router.post("/subject/reply", repliesController.createReReply)

// 전체 댓글 조회
router.get("/subject/:post_no", repliesController.readReply)

// 댓글 삭제
router.delete("/subject/:bundle_id", repliesController.deleteReply)

router.delete("/subject/reply/:reply_no", repliesController.deleteRereply)

// REPLY UPDATE - 댓글 수정 (불가)
// router.put("/update/:id", replyController.updateReply)

// REREPLY UPDATE - 대댓글 수정 (불가)
//router.put("/update/rereply/:id", replyController.updateReReply)

// REPLY READ COUNT - 댓글 수 카운트
// router.get("/read/count/:post", replyController.readCountReply)


/* 자유게시판 */
// 댓글 작성
router.post("/free", freeBoardReplyController.createReply)

// 대댓글 작성
router.post("/free/reply", freeBoardReplyController.createReReply)

// 전체 댓글 조회
router.get("/free/:post_no", freeBoardReplyController.readReply)

// 댓글 삭제
router.delete("/free/:bundle_id", freeBoardReplyController.deleteReply)

// 대댓글 삭제
router.delete("/free/reply/:reply_no", freeBoardReplyController.deleteRereply)


/* 학과게시판 */
// 댓글 작성
router.post("/major", majorBoardReplyController.createReply)

// 대댓글 작성
router.post("/major/reply", majorBoardReplyController.createReReply)

// 전체 댓글 조회
router.get("/major/:post_no", majorBoardReplyController.readReply)

// 댓글 삭제
router.delete("/major/:bundle_id", majorBoardReplyController.deleteReply)

// 대댓글 삭제
router.delete("/major/reply/:reply_no", majorBoardReplyController.deleteRereply)


module.exports = router;