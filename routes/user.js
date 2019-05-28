const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

const { isLoggedIn } = require('../global');

router.get('/edit', isLoggedIn, userControllers.editGet);

router.post('/edit', isLoggedIn, userControllers.editPost);

module.exports = router;