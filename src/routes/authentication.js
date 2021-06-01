const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.post('/signup', /* isNotLoggedIn, */ async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;
    const rows = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = ?', nombreUsuario);
    console.log(rows[0]);
    if (rows[0] != null) {
        const valiPassword = await helpers.matchPassword(contrasena, rows[0].contrasena);
        if (valiPassword) {
            if (rows[0].estado != 0) {
                res.json({
                    nombreUsuario: rows[0].nombreUsuario,
                    nombreEstacion: rows[0].nombreEstacion
                });
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

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