var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Trang chủ',
    topBrand: [{
      image: '/images/apple.png',
      name: 'Apple',
      delay: 0,
    }, {
      image: '/images/samsung.png',
      name: 'Samsung',
      delay: 150,
    }, {
      image: '/images/xiaomi.jpg',
      name: 'Xiaomi',
      delay: 300,
    }]
  });
});

module.exports = router;
