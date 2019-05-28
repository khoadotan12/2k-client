const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const passport = require('passport');

const { isUnLoggedIn } = require('../global');

/* GET home page. */
router.get('/', homeControllers.home);

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

router.get('/login', isUnLoggedIn, homeControllers.loginGet);

router.get('/recover', homeControllers.recoverGet);

router.get('/register', homeControllers.registerGet);

router.post('/register', homeControllers.registerPost);

router.post('/register/verifyEmail', homeControllers.verifyEmail);

router.get('/logout', homeControllers.logout);

module.exports = router;
