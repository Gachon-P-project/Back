const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();

const boardRoutes = require('./board')
const userRoutes = require('./user')
const replyRoutes = require('./reply')
const noticeRoutes = require('./notice')
const likeRoutes = require('./like')

router.use('/board', boardRoutes)
router.use('/user', userRoutes)
router.use('/reply', replyRoutes)
router.use('/notice', noticeRoutes)
router.use('/like', likeRoutes)
// router.use('/timeTable', timeTableRoutes)

module.exports = router;