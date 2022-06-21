const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication');

router.get('/register', authentication.renderRegisterForm)

router.get('/login', authentication.renderLoginForm)

module.exports = router;