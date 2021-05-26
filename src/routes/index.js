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
        //console.log(consulta);
        if (consulta[0] != null) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    const { placa } = req.body;
    try {
        const consul = await pool.query('INSERT INTO registro (placa) VALUES (?)', placa);
        await pool.query('UPDATE registro SET fecha = DATE_SUB(fecha, INTERVAL 5 HOUR) WHERE idregistro = ?', consul.insertId);
        //res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }

});

module.exports = router;