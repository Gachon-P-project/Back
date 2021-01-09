const express = require('express');
const router = express.Router();
const boardController = require('./../controllers/boardController');
const freeBoardController = require('./../controllers/freeBoardController');
const majorBoardController = require('./../controllers/majorBoardController');


// SUBJECTBOARD CREATE - 과목게시판 새 글 작성
router.post("/insert", boardController.createBoard)

// SELECT SUBJECT BOARD - 과목게시판 전체 글 조회 
router.get("/select/:subject/:professor/:userNo", boardController.readList)

// SUBJECT BOARD READ - 과목게시판 특정 단어로 글 조회
router.get("/select/:subject/:professor/:userNo/search/:word", boardController.readSomeList)

// SUBJECT BOARD UPDATE - 과목게시판 내 선택한 글 수정
router.put("/update/:id", boardController.updateBoard)

// SUBJECT BOARD DELETE - 과목게시판 내 선택한 글 삭제
router.delete("/delete/:id", boardController.deleteBoard)



// FREE BOARD CREATE - 자유게시판 새 글 작성
router.post("/free/insert", freeBoardController.createBoard)

// FREE BOARD CREATE - 자유게시판 전체 글 조회
router.get("/free/select/:boardFlag/:userNo", freeBoardController.readList)

// FREE BOARD READ - 자유게시판 특정 단어로 글 조회
router.get("/free/select/:boardFlag/:userNo/search/:word", freeBoardController.readSomeList)

// FREE BOARD UPDATE - 자유게시판 내 선택한 글 수정
router.put("/free/update/:postNo", freeBoardController.updateBoard)

// FREE BOARD DELETE - 자유게시판 내 선택한 글 삭제
router.delete("/free/delete/:postNo", freeBoardController.deleteBoard)



// MAJOR BOARD CREATE - 학과게시판 새 글 작성
router.post("/major/insert", majorBoardController.createBoard)

// MAJOR BOARD CREATE - 학과게시판 전체 글 조회
router.get("/major/select/:boardFlag/:userNo", majorBoardController.readList)

// SUBJECT BOARD READ - 학과게시판 특정 단어로 글 조회
router.get("/major/select/:boardFlag/:userNo/search/:word", majorBoardController.readSomeList)

// SUBJECT BOARD UPDATE - 학과게시판 내 선택한 글 수정
router.put("/major/update/:postNo", majorBoardController.updateBoard)

// SUBJECT BOARD DELETE - 학과게시판 내 선택한 글 삭제
router.delete("/major/delete/:postNo", majorBoardController.deleteBoard)




// MY BOARD READ - 내가 쓴 글 조회
router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)

// MY REPLY READ - 내가 댓글쓴 글 조회
// router.get("/myBoard/select/list/:userNo", boardController.readMyBoardList)



// BOARD READ - 과목게시판 내 선택한 글 상세보기
// router.get("/select/:id", boardController.readDetailBoard)


module.exports = router;


