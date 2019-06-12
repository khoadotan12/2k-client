const express = require('express');
const router = express.Router();

const cartControllers = require('../controllers/cartControllers');


router.get('/', cartControllers.index);

router.post('/addCart', cartControllers.addCart);

router.delete('/delete', cartControllers.deleteItem);

router.post('/updateCart', cartControllers.updateCart);

module.exports = router