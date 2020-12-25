const express = require('express');
const router = express.Router();
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

// const likeController = require('../controllers/likeController')

// mode : 좋아요 상태를 바꿀 것이 게시글인지 댓글인지 대댓글인지 표기
// 게시글 : post, 댓글 : upment, 대댓글 : downment
// objectId : 좋아요 상태를 바꿀 것의 ObjectId
// postId : 부모 게시글의 ObjectId 값. 댓글과 대댓글일 경우 필요. 게시글일 경우 0
router.get("/like/:mode/:objectId/:postId/:userId", (req, res) => {



})


module.exports = router;