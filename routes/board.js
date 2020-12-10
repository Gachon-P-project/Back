const express = require('express');
const router = express.Router();
const boardController = require('./../controllers/boardController')

// 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
router.get("/:subject/:professor", boardController.getList)

module.exports = router;