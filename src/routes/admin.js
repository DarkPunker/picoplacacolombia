const express = require('express');
const router = express.Router();
const client = require('../database');
const { isLoggedInAdmin } = require('../lib/auth');

router.post('/editUser/:nombre', /* isLoggedInAdmin, */ async (req, res) => {
    const { nombre } = req.params;
    const { estado } = req.body;
    try {
        const { rows } = await client.query('SELECT nombreusuario FROM usuario WHERE estado != $1 AND nombreusuario = $2;', [estado, nombre]);
        if (rows[0] != null) {
            await client.query('UPDATE usuario SET estado = $1 WHERE nombreusuario = $2', [estado, nombre]);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;