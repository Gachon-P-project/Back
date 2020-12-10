const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')

// USER CREATE - 새 유저 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
router.post("/user/insert", userController.putUser)








module.exports = router;