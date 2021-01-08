const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const likeController = require('../controllers/likeController')

// LIKE CREATE - 좋아요, 좋아요 취소
router.post("/insert/:postNo/:userNo/:boardFlag", likeController.createLike)

// LIKE READ - 좋아요 개수 조회
router.get("/read/:postNo/:boardFlag", likeController.readLike)


module.exports = router;