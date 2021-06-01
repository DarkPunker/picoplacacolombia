const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


//initilazation
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(session({
    secret: 'texto',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));


//public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});