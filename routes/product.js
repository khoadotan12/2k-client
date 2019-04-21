var express = require('express');
var router = express.Router();

router.get('/:category/:id', (req, res, next) => {
    const data = {
        name: 'iPhone XS Max 64 GB',
        brand: 'Apple',
        price: '28,790,000',
        color: ['Bạc', 'Vàng', 'Xám'],
        shortInfo: ['Hệ điều hành: iOS 12', 'RAM: 4 GB', 'ROM: 64 GB', 'Chip xử lý: A12 Bionic 64-bit 7nm'],
        info: {
            screen: '6.5 inches',
            ram: '4 GB',
            rom: '64 GB',
            frontCamera: '7 MP',
            backCamera: '12 MP',
            os: 'iOS 12',
            sim: '2',
            pin: '3174 mAh'
        }
    }
    res.render('product/info', { title: data.name, data })
});

module.exports = router