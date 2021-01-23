const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boardsController');
const freeBoardController = require('../controllers/freeBoardController');
const majorBoardController = require('../controllers/majorBoardController');

/* 수업 게시판 */
// 게시글 작성
router.post("/subject", boardsController.createBoard) 

// 전체 게시글 조회 
router.get("/subject/:subject/:professor/:user_no/:page_num", boardsController.readList)

// 특정 게시글 조회
router.get("/subject/:subject/:professor/:user_no/:word/:page_num", boardsController.readSomeList)

// 게시글 수정
router.put("/subject", boardsController.updateBoard)

// 게시글 삭제
router.delete("/subject/:post_no", boardsController.deleteBoard)


/* 자유 게시판 */
// 게시글 작성
router.post("/free", freeBoardController.createBoard)

// 전체 게시글 조회 
router.get("/free/:boardFlag/:userNo/:page_num", freeBoardController.readList)

// 특정 게시글 조회
router.get("/free/:boardFlag/:userNo/:word/:page_num", freeBoardController.readSomeList)

// 게시글 수정
router.put("/free", freeBoardController.updateBoard)

// 게시글 삭제
router.delete("/free/:post_no", freeBoardController.deleteBoard)


/* 학과 게시판 */
// 게시글 작성
router.post("/major", majorBoardController.createBoard)

// 전체 게시글 조회
router.get("/major/:board_flag/:user_no/:major/:page_num", majorBoardController.readList)

// 특정 게시글 조회
router.get("/major/:board_flag/:user_no/:major/:word/:page_num", majorBoardController.readSomeList)

// 게시글 수정
router.put("/major", majorBoardController.updateBoard)

// 게시글 삭제
router.delete("/major/:post_no", majorBoardController.deleteBoard)




// 내가 쓴 글 조회
router.get("/myBoard/list/:userNo", boardsController.readMyBoardList)

// MY REPLY READ - 내가 댓글쓴 글 조회
// router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)




// BOARD READ - 과목게시판 내 선택한 글 상세보기
// router.get("/select/:id", boardController.readDetailBoard)


module.exports = router;


