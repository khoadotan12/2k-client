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
    }],
    hotItems: [{
      name: 'iPhone XS Max 64 GB',
      image: '/images/iphoneXSMax.png',
      price: '23.490.000'
    }, {
      name: 'Samsung Galaxy S9',
      image: '/images/galaxyS9.png',
      price: '17.890.000'
    }, {
      name: 'iPhone X 64 GB',
      image: '/images/apple.png',
      price: '21.000.000'
    }, {
      name: 'Oppo F11 Pro',
      image: '/images/oppof11pro.png',
      price: '8.490.000'
    }, {
      name: 'Xiaomi Redmi Note 7',
      image: '/images/xiaomi.jpg',
      price: '4.090.000'
    }],
  });
});

router.get('/login', (req, res) => {
  res.render('authen/login', {title: 'Đăng nhập'})
});

module.exports = router;
