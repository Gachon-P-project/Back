const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boardsController');
const freeBoardController = require('../controllers/freeBoardController');
const majorBoardController = require('../controllers/majorBoardController');

/* 수업 게시판 */
// 게시글 작성
router.post("/subject", boardsController.createBoard) 

// 전체 게시글 조회 
router.get("/subject/:subject/:professor/:userNo", boardsController.readList)

// 특정 게시글 조회
router.get("/subject/:subject/:professor/:userNo/:word", boardsController.readSomeList)

// 게시글 수정
router.put("/subject/:post_no", boardsController.updateBoard)

// 게시글 삭제
router.delete("/subject/:post_no", boardsController.deleteBoard)


/* 자유 게시판 */
// 게시글 작성
router.post("/free", freeBoardController.createBoard)

// 전체 게시글 조회 
router.get("/free/:boardFlag/:userNo", freeBoardController.readList)

// 특정 게시글 조회
router.get("/free/:boardFlag/:userNo/:word", freeBoardController.readSomeList)

// 게시글 수정
router.put("/free", freeBoardController.updateBoard)

// 게시글 삭제
router.delete("/free", freeBoardController.deleteBoard)


/* 학과 게시판 */
// 게시글 작성
router.post("/major", majorBoardController.createBoard)

// 전체 게시글 조회
router.get("/major/:boardFlag/:userNo", majorBoardController.readList)

// 특정 게시글 조회
router.get("/major/:boardFlag/:userNo/:word", majorBoardController.readSomeList)

// 게시글 수정
router.put("/major", majorBoardController.updateBoard)

// 게시글 삭제
router.delete("/major", majorBoardController.deleteBoard)




// 내가 쓴 글 조회
router.get("/myBoard/list/:userNo", boardController.readMyBoardList)

// MY REPLY READ - 내가 댓글쓴 글 조회
// router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)




// BOARD READ - 과목게시판 내 선택한 글 상세보기
// router.get("/select/:id", boardController.readDetailBoard)


module.exports = router;


