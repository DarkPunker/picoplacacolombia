const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const client = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasena, done) => {
    const { rows } = await client.query('SELECT * FROM usuario WHERE nombreusuario = $1', [nombreUsuario]);
    console.log(rows[0]);
    if (rows[0] != null) {
        const valiPassword = await helpers.matchPassword(contrasena, rows[0].contrasena);
        if (valiPassword) {
            if (rows[0].estado != 0) {

            } else {

            }
        } else {

        }
    } else {

    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasena, done) => {
    const { nombreEstacion } = req.body;
    const newUser = {
        nombreUsuario,
        contrasena,
        nombreEstacion
    };
    const { rows } = await client.query('SELECT * FROM usuario WHERE nombreusuario = $1;', [nombreUsuario]);
    console.log(rows);
    if (rows[0] != null) {
        done(null, false, req.flash('message', 'Usuario ya esta en uso'));
    } else {
        newUser.contrasena = await helpers.encyptPassword(contrasena);
        await client.query('INSERT INTO usuario (nombreusuario, contrasena, nombreestacion) VALUES ($1,$2,$3);', 
        [newUser.nombreUsuario, newUser.contrasena, newUser.nombreEstacion]);
        return done(null, newUser);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.nombreUsuario)
});

passport.deserializeUser(async (nombreUsuario, done) => {
    const { rows } = await client.query('SELECT * FROM usuario WHERE nombreusuario = $1', [nombreUsuario]);
    done(null, rows);
});