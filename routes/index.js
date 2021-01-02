const express = require('express');
const router = express.Router({mergeParams: true});
const dotenv = require('dotenv').config();

const boardRoutes = require('./board')
const userRoutes = require('./user')
const replyRoutes = require('./reply')
const noticeRoutes = require('./notice')
const likeRoutes = require('./like')
const tokenRoutes = require('./token')
const scrapRoutes = require('./scrap')

router.use('/board', boardRoutes)
router.use('/user', userRoutes)
router.use('/reply', replyRoutes)
router.use('/notice', noticeRoutes)
router.use('/like', likeRoutes)
router.use('/token', tokenRoutes)
router.use('/scrap', scrapRoutes)


module.exports = router;