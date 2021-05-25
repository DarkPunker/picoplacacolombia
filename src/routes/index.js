const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    const { placa, fecha } = req.body;
    const consulta = await pool.query('SELECT * FROM registro WHERE placa = ? AND fecha = ?', [placa,fecha]);
    if (consulta!=null) {
        res.sendStatus(404)
    }else{
        res.sendStatus(200);
    }
});

router.post('/', async (req, res) => {
    const { placa } = req.body;
    await pool.query('INSERT INTO registro set ?', placa);
    req.flash('success', 'registro correcto');
});

module.exports = router;