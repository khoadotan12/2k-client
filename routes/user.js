const express = require('express');
const passport = require('passport');

const router = express.Router();
const userControllers = require('../controllers/userControllers');


const { isLoggedIn, isUnLoggedIn } = require('../global');

router.get('/edit', isLoggedIn, userControllers.editGet);

router.post('/edit', isLoggedIn, userControllers.editPost);

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true }), userControllers.loginPost);

router.get('/login', isUnLoggedIn, userControllers.loginGet);

router.get('/recover', isUnLoggedIn, userControllers.recoverGet);

router.post('/recover', isUnLoggedIn, userControllers.recoverPost);

router.get('/register', userControllers.registerGet);

router.get('/changepassword', isLoggedIn, userControllers.changePasswordGet);

router.post('/changepassword', isLoggedIn, userControllers.changePasswordPost);

router.post('/register', isUnLoggedIn, userControllers.registerPost);

router.post('/register/verifyEmail', userControllers.verifyEmail);

router.get('/logout', isLoggedIn, userControllers.logout);

router.get('/active', isLoggedIn, userControllers.sendMail);

router.get('/active/:id/:token', userControllers.active);

router.get('/reset/:id/:token', isUnLoggedIn, userControllers.resetGet);

router.post('/reset/:id/:token', isUnLoggedIn, userControllers.resetPost);

module.exports = router;