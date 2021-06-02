const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const moment = require('moment-timezone');

function getDateTime() {

    var date = moment.tz(Date.now(), "America/Bogota");
    
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
    
    return date;
}

router.get('/:placa', /* isLoggedIn, */ async (req, res) => {
    const { placa } = req.params;
    try {
        var fecha = getDateTime();
        res.json({
            fecha: fecha
            });
        /* const consulta = await pool.query("SELECT placa, DATE_FORMAT(fecha,'%Y-%m-%d %h:%i:%s %p') AS fecha, nombreEstacion FROM registro INNER JOIN usuario ON registro.fkUsuario = usuario.idUsuario WHERE placa = ? AND fecha >= ?", [placa, fecha]);
        if (consulta[0] != null) {
            res.json({
                placa: consulta[0].placa,
                nombreEstacion: consulta[0].nombreEstacion,
                fecha: consulta[0].fecha
            });
        } else {
            res.sendStatus(404);
        } */
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/', /* isLoggedIn, */ async (req, res) => {
    const { placa, nombreUsuario } = req.body;
    try {
        const id = await pool.query('SELECT idUsuario FROM usuario WHERE nombreUsuario = ?', nombreUsuario);
        const consul = await pool.query('INSERT INTO registro (placa, fkUsuario) VALUES (?,?)', [placa, id[0].idUsuario]);
        await pool.query('UPDATE registro SET fecha = DATE_SUB(fecha, INTERVAL 5 HOUR) WHERE idregistro = ?', consul.insertId);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }

});

module.exports = router;