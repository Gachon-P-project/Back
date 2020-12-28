const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const likeController = require('../controllers/likeController')

// LIKE CREATE - 좋아요
router.post("/insert/:postNo/:userNo", likeController.createLike)

// LIKE DELETE - 좋아요 취소
// router.delete("/delete/:postNo/:userNo", likeController.deleteLike)

// LIKE CREATE - 좋아요 개수 조회
// router.get("/read/:postNo", likeController.readLike)


module.exports = router;