const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')

// USER CREATE - 새 유저 등록
router.post("/insert", userController.createUser)

module.exports = router;