const express = require('express');
const router = express.Router();

const checkoutControllers = require('../controllers/checkoutControllers');

const { isLoggedIn } = require('../global');

router.get('/', isLoggedIn, checkoutControllers.home);

router.get('/done', isLoggedIn, checkoutControllers.done);

module.exports = router;