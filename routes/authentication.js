const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication')
const passport = require('passport')

router.route('/register')
    .get(authentication.renderRegisterForm)
    .post(authentication.register)

router.route('/login')
    .get(authentication.renderLoginForm)
    .post(
        passport.authenticate('local', {
            failureFlash: true, failureRedirect: '/login'
        }),
        authentication.login
    )

router.get('/logout', authentication.logout);

module.exports = router;
