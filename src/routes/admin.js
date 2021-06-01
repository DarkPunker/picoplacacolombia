const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedInAdmin } = require('../lib/auth');

router.post('/editUser/:nombre', /* isLoggedInAdmin, */ async (req, res) => {
    const { nombre } = req.params;
    const { estado } = req.body;
    try {
        const cons = await pool.query('SELECT nombreUsuario FROM usuario WHERE estado != ? AND nombreUsuario = ?;', [estado, nombre]);
        if(cons[0] != null) {
            await pool.query('UPDATE usuario SET estado = ? WHERE nombreUsuario = ?', [estado, nombre]);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;