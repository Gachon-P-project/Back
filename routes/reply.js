const express = require('express');
const router = express.Router();
const replyController = require('./../controllers/replyController')

// REPLY CREATE - 새 댓글 작성
router.post("/insert/:user/:post", replyController.createReply)

module.exports = router;