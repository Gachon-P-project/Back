const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

const likesController = require('../controllers/likesController')

// LIKE CREATE - 좋아요, 좋아요 취소
router.post("/", likesController.createLike)

// LIKE READ - 좋아요 개수 조회
router.get("/:post_no", likesController.readLike)


module.exports = router;