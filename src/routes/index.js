const express = require('express');
const router = express.Router();
const client = require('../database');
const moment = require('moment-timezone');

function getDateTime() {

    var fecha = moment.tz(Date.now(), "America/Bogota").format('YYYY-MM-DD');

    return fecha;
}

router.get('/:placa', /* isLoggedIn, */ async (req, res) => {
    const { placa } = req.params;
    console.log("PLACA", placa, getDateTime())
    try {

        const text = `SELECT placa, to_char(fecha,'YYYY-MM-DD HH:MI:SS') AS fecha, nombreestacion 
        FROM registro 
        INNER JOIN usuario ON registro.fkusuario = usuario.idusuario 
        WHERE placa = $1 AND fecha >= $2`

        const { rows } = await client.query(text, [placa, getDateTime()]);
        console.log("consulta", rows);
        //res.json(rows);
        res.status(200).send(rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/', /* isLoggedIn, */ async (req, res) => {
    const { placa, nombreUsuario } = req.body;
    try {
        const { rows } = await client.query('SELECT idusuario FROM usuario WHERE nombreusuario = $1', [nombreUsuario]);
        console.log("id----", rows[0].idusuario)
        const consul = await client.query('INSERT INTO registro (placa, fkusuario) VALUES ($1,$2) RETURNING *', [placa, rows[0].idusuario]);
        console.log("consul----", consul.rows[0].idregistro)
        await client.query(`UPDATE registro 
        SET fecha = CURRENT_TIMESTAMP - interval '5 hours',
        fechasiguiente = CURRENT_TIMESTAMP + interval '2 days'
        WHERE idregistro = $1`, [consul.rows[0].idregistro]);
        res.sendStatus(200);
    } catch (error) {
        console.error("error----", error)
        res.sendStatus(500);
    }

});

module.exports = router;