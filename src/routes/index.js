const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    const { placa, fecha } = req.body;
    try {
        const consulta = await pool.query('SELECT * FROM registro WHERE placa = ? AND fecha = ?', [placa, fecha]);
        if (consulta != null) {
            res.sendStatus(404)
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500);
    }


});

router.post('/', async (req, res) => {
    const { placa } = req.body;
    try {
        await pool.query('INSERT INTO registro (placa) VALUES (?)', placa);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }

});

module.exports = router;