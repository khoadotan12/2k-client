const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const passport = require('passport');

/* GET home page. */
router.get('/', homeControllers.home);

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login',  failureFlash: true }));

router.get('/login', isUnLoggedIn, homeControllers.loginGet);

router.get('/recover', homeControllers.recoverGet);

router.get('/register', homeControllers.registerGet);

router.post('/register/verifyEmail', homeControllers.verifyEmail);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function isUnLoggedIn(req, res, next) {
    if (req.isUnauthenticated())
        return next();
    res.redirect('/');
}
