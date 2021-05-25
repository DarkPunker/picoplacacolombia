const express = require('express');
const router = express.Router();
const pool = require('../database');

function getDateTime() {

    var date = new Date();

    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
    
    return date;
}

router.get('/:placa', async (req, res) => {
    const { placa } = req.params;
    try {
        const consulta = await pool.query('SELECT * FROM registro WHERE placa = ? AND fecha >= ?', [placa, getDateTime() ]);
        if (consulta[0] != null) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404);
        }
        /* console.log(consulta); */
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/:placa', async (req, res) => {
    const { placa } = req.body;
    try {
        await pool.query('INSERT INTO registro (placa) VALUES (?)', placa);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }

});

module.exports = router;