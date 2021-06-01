module.exports = {
    isLoggedInUser(req, res, next) {
        if ((req.usuario.rol == 1 || req.usuario.rol == 2 || req.usuario.rol == 3) && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isLoggedIn(req, res, next) {
        if ((req.usuario.rol == 2 || req.usuario.rol == 3) && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isLoggedInAdmin(req, res, next) {
        if (req.usuario.rol == 2 && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    }
};