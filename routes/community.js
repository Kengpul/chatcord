const express = require('express');
const router = express.Router();
const community = require('../controller/community');

router.get('/', community.index)

router.get('/:room', community.room)

module.exports = router;