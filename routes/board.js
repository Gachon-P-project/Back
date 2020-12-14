const express = require('express');
const router = express.Router();
const boardController = require('./../controllers/boardController');

// SELECT SUBJECT BOARD - 과목게시판 전체 글 조회
router.get("/select/:subject/:professor", boardController.readList)

// BOARD READ - 과목게시판 특정 단어로 글 조회
router.get("/select/:subject/:professor/search/:word", boardController.readSomeList)

// BOARD READ - 과목게시판 내 선택한 글 상세보기
router.get("/select/:id", boardController.readDetailBoard)

// BOARD CREATE - 과목게시판 새 글 작성
router.post("/insert", boardController.createBoard)

// BOARD UPDATE - 과목게시판 내 선택한 글 수정
router.post("/update/:id", boardController.updateBoard)

// BOARD DELETE - 과목게시판 내 선택한 글 삭제
router.get("/delete/:id", boardController.deleteBoard)



module.exports = router;