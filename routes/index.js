const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const passport = require('passport');

/* GET home page. */
router.get('/', homeControllers.home);

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

router.get('/login', homeControllers.loginGet);

router.get('/recover', homeControllers.recoverGet);

router.get('/register', homeControllers.registerGet);

module.exports = router;
