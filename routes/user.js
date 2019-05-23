const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

router.get('/', isLoggedIn, userControllers.editGet);

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