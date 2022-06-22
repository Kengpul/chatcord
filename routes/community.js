const express = require('express');
const router = express.Router();
const community = require('../controller/community');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, community.index)

router.get('/:room', isLoggedIn, community.room)

module.exports = router;