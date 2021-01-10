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
router.delete("/subject", repliesController.deleteReply)

// 대댓글 삭제
router.delete("/subject/reply", repliesController.deleteRereply)

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
router.post("/free/rereply", freeBoardReplyController.createReReply)

// 전체 댓글 조회
router.get("/free/:postNo", freeBoardReplyController.readReply)

// 댓글 삭제
router.delete("/free", freeBoardReplyController.deleteReply)

// 대댓글 삭제
router.delete("/free/rereply", freeBoardReplyController.deleteRereply)


/* 학과게시판 */
// 댓글 작성
router.post("/major", majorBoardReplyController.createReply)

// 대댓글 작성
router.post("/major/rereply", majorBoardReplyController.createReReply)

// 전체 댓글 조회
router.get("/major/:postNo", majorBoardReplyController.readReply)

// 댓글 삭제
router.delete("/major", majorBoardReplyController.deleteReply)

// 대댓글 삭제
router.delete("/major/rereply", majorBoardReplyController.deleteRereply)







/**
 * const express = require('express');
const router = express.Router();
const replyController = require('./../controllers/replyController')
const freeBoardReplyController = require('./../controllers/freeBoardReplyController')
const majorBoardReplyController = require('./../controllers/majorBoardReplyController')

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



// FREEBOARD REPLY CREATE - 자유게시판 새 댓글 작성
router.post("/free/insert/:user/:post", freeBoardReplyController.createReply)

// FREEBOARD REREPLY CREATE - 자유게시판 대댓글 작성
router.post("/free/insert/rereply/:userNo/:postNo/:replyNo", freeBoardReplyController.createReReply)

// FREEBOARD REPLY READ - 자유게시판 댓글 보기
router.get("/free/read/:post", freeBoardReplyController.readReply)

// FREEBOARD REPLY DELETE - 자유게시판 댓글 삭제
router.delete("/free/delete/:bundleId", freeBoardReplyController.deleteReply)

// FREEBOARD REREPLY DELETE - 자유게시판 대댓글 삭제
router.delete("/free/delete/rereply/:replyNo", freeBoardReplyController.deleteRereply)



// MAJORBOARD REPLY CREATE - 과목게시판 새 댓글 작성
router.post("/major/insert/:user/:post", majorBoardReplyController.createReply)

// MAJORBOARD REREPLY CREATE - 과목게시판 대댓글 작성
router.post("/major/insert/rereply/:userNo/:postNo/:replyNo", majorBoardReplyController.createReReply)

// MAJORBOARD REPLY READ - 과목게시판 댓글 보기
router.get("/major/read/:post", majorBoardReplyController.readReply)

// MAJORBOARD REPLY DELETE - 과목게시판 댓글 삭제
router.delete("/major/delete/:bundleId", majorBoardReplyController.deleteReply)

// MAJORBOARD REREPLY DELETE - 과목게시판 대댓글 삭제
router.delete("/major/delete/rereply/:replyNo", majorBoardReplyController.deleteRereply)


 */




module.exports = router;