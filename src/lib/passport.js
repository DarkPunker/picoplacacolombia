const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'idusuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, idusuario, contrasena, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = ?', idusuario);
    if (rows[0].length > 0) {
        const user = rows[0][0];
        const valiPassword = await helpers.matchPassword(contrasena, user.Contrasena);
        if (valiPassword) {
            if (user.estado != 0) {
                done(null, user, req.flash('success', 'Bienvenido ' + user.idUsuario));
            } else {
                done(null, false, req.flash('message', 'Usuario inactivo'));
            }
        } else {
            done(null, false, req.flash('message', 'Contraseña invalida'));
        }
    } else {
        done(null, false, req.flash('message', 'Usuario invalido'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'idUsuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, idUsuario, contrasena, done) => {
    const { nombreEstacion } = req.body;
    const newUser = {
        idUsuario,
        contrasena,
        nombreEstacion
    };
    const rows = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = ?', [idUsuario]);
    if (rows[0].length > 0) {
        done(null, false, req.flash('message', 'Usuario ya esta en uso'));
    } else {
        newUser.contrasena = await helpers.encyptPassword(contrasena);
        await pool.query('INSERT INTO usuario (nombreUsuario,contrasena,nombreEstacion) VALUES (?,?,?)', [newUser.idUsuario, newUser.contrasena, newPerson.nombreEstacion]);
        return done(null, newUser);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.idUsuario)
});

passport.deserializeUser(async (idUsuario, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE nombreUsuario = ?', [idUsuario]);
    done(null, rows[0][0]);
});