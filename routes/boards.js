const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boardsController');
const freeBoardController = require('../controllers/freeBoardController');
const majorBoardController = require('../controllers/majorBoardController');

/* 수업 게시판 */
// 게시글 작성
router.post("/subject", boardsController.createBoard) 

// 전체 게시글 조회 
router.get("/subject/:subject/:professor/:user_no", boardsController.readList)

// 특정 게시글 조회
router.get("/subject/:subject/:professor/:user_no/:word", boardsController.readSomeList)

// 게시글 수정
router.put("/subject", boardsController.updateBoard)

// 게시글 삭제
router.delete("/subject", boardsController.deleteBoard)



// // MY BOARD READ - 내가 쓴 글 조회
// router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)

// // MY REPLY READ - 내가 댓글쓴 글 조회
// // router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)

// // FREE BOARD CREATE - 자유게시판 새 글 작성
// router.post("/free/insert", freeBoardController.createBoard)
// /*
// // FREE BOARD CREATE - 자유게시판 전체 글 조회
// router.get("/free/select", freeBoardController.createBoard)

// // SUBJECT BOARD READ - 자유게시판 특정 단어로 글 조회
// router.get("/free/select/:userNo/search/:word", freeBoardController.readSomeList)
// */

// // SUBJECT BOARD UPDATE - 자유게시판 내 선택한 글 수정
// router.put("/free/update/:postNo", freeBoardController.updateBoard)

// // SUBJECT BOARD DELETE - 자유게시판 내 선택한 글 삭제
// router.delete("/free/delete/:postNo", freeBoardController.deleteBoard)



// // BOARD READ - 과목게시판 내 선택한 글 상세보기
// // router.get("/select/:id", boardController.readDetailBoard)

// /*
// // MAJOR BOARD CREATE - 학과게시판 새 글 작성
// router.post("/major/insert", majorBoardController.createBoard)

// // MAJOR BOARD CREATE - 학과게시판 전체 글 조회
// router.get("/major/select/:major", majorBoardController.createBoard)

// // SUBJECT BOARD READ - 학과게시판 특정 단어로 글 조회
// router.get("/major/select/:major/:userNo/search/:word", majorBoardController.readSomeList)

// // SUBJECT BOARD UPDATE - 학과게시판 내 선택한 글 수정
// router.put("/major/update/:id", majorBoardController.updateBoard)

// // SUBJECT BOARD DELETE - 학과게시판 내 선택한 글 삭제
// router.delete("/major/delete/:id", majorBoardController.deleteBoard)
// */


module.exports = router;


