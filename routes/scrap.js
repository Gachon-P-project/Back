const express = require('express');
const router = express.Router();
const scrapController = require('./../controllers/scrapController')

// SCRAP CREATE - 게시글 스크랩/스크랩 취소
router.post("/insert/:post/:userNo", scrapController.createScrap)

// SCRAP CREATE - 스크랩 게시물 리스트
router.post("/select/:userNo", scrapController.readScrap)

module.exports = router;