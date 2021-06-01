const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedInAdmin } = require('../lib/auth');
const Carousel = require('../models/carousel');

router.post('/editUser/:nombre', isLoggedInAdmin, async (req, res) => {
    const { nombre } = req.params;
    const { estado } = req.body;
    try {
        await pool.query('UPDATE usuario SET estadoUsuario = ? WHERE nombreUsuario = ?', [estado, nombre]);
        req.flash('success', 'Usuario Modificado Correctamente');
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;