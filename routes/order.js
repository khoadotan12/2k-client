const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderControllers');

const { isLoggedIn } = require('../global');


router.get('/', isLoggedIn, orderControllers.home);

module.exports = router