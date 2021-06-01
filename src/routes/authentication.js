const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.post('/signup', /* isNotLoggedIn, */ passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/signin', /* isNotLoggedIn, */ (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;