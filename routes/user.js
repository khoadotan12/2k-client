const express = require('express');
const passport = require('passport');

const router = express.Router();
const userControllers = require('../controllers/userControllers');


const { isLoggedIn, isUnLoggedIn } = require('../global');

router.get('/edit', isLoggedIn, userControllers.editGet);

router.post('/edit', isLoggedIn, userControllers.editPost);

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login', failureFlash: true }));

router.get('/login', isUnLoggedIn, userControllers.loginGet);

router.get('/recover', userControllers.recoverGet);

router.get('/register', userControllers.registerGet);

router.get('/changepassword', isLoggedIn, userControllers.changePasswordGet);

router.post('/changepassword', isLoggedIn, userControllers.changePasswordPost);

router.post('/register', userControllers.registerPost);

router.post('/register/verifyEmail', userControllers.verifyEmail);

router.get('/logout', userControllers.logout);

module.exports = router;