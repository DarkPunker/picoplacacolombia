module.exports = {
    isLoggedInUser(req, res, next) {
        if ((req.user.rol == 1 || req.user.rol == 2 || req.user.rol == 3) && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isLoggedIn(req, res, next) {
        if ((req.user.rol == 2 || req.user.rol == 3) && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isLoggedInAdmin(req, res, next) {
        if (req.user.rol == 2 && req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    isNotLoggedIn(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    }
};