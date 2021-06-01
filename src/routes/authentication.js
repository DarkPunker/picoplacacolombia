const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.post('/signup', /* isNotLoggedIn, */ passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/signin', /* isNotLoggedIn, */ async (req, res, next) => {
    const { nombreUsuario, contrasena } = req.body;
    console.log(nombreUsuario," ", contrasena);
    try {
        const rows = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = ?', nombreUsuario);
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
    } catch (error) {
        res.sendStatus(500);
    }

});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;