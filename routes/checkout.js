const express = require('express');
const router = express.Router();

const checkoutControllers = require('../controllers/checkoutControllers');

router.get('/', isLoggedIn, checkoutControllers.home);

router.get('/done', isLoggedIn, checkoutControllers.done);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}