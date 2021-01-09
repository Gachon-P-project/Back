const express = require('express');
const router = express.Router({mergeParams: true});
const dotenv = require('dotenv').config();

const boardsRoutes = require('./boards')
const usersRoutes = require('./users')
const repliesRoutes = require('./replies')
const noticesRoutes = require('./notices')
const likesRoutes = require('./likes')
const tokensRoutes = require('./tokens')
const scrapsRoutes = require('./scraps')

router.use('/boards', boardsRoutes)
router.use('/users', usersRoutes)
router.use('/replies', repliesRoutes)
router.use('/notices', noticesRoutes)
router.use('/likes', likesRoutes)
router.use('/tokens', tokensRoutes)
router.use('/scraps', scrapsRoutes)


module.exports = router;