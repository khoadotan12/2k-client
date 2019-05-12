const productModel = require('../models/product');
const brandModel = require('../models/brand');
const { formatPrice } = require('../global');
function parseData(raw) {
    const data = { ...raw };
    data.price = formatPrice(raw.price);
    return data;
}
exports.home = async (req, res, next) => {
    const data = {
        banner: '/images/banner.jpg',
        bannerURI: '/product/samsung/5cd43bca675b57068d1b2b8d',
        // topBrand: [{
        //     image: '/images/apple.png',
        //     name: 'Apple',
        //     delay: 0,
        // }, {
        //     image: '/images/samsung.png',
        //     name: 'Samsung',
        //     delay: 150,
        // }, {
        //     image: '/images/xiaomi.jpg',
        //     name: 'Xiaomi',
        //     delay: 300,
        // }],
        // hotItems: [{
        //     name: 'iPhone XS Max 64 GB',
        //     image: '/images/iphoneXSMax.png',
        //     price: '23.490.000',
        //     uri: '/apple/1',
        // }, {
        //     name: 'Samsung Galaxy S9',
        //     image: '/images/galaxyS9.png',
        //     price: '17.890.000',
        //     uri: '/samsung/2',
        // }, {
        //     name: 'iPhone X 64 GB',
        //     image: '/images/apple.png',
        //     uri: '/apple/2',
        //     price: '21.000.000'
        // }, {
        //     name: 'Oppo F11 Pro',
        //     image: '/images/oppof11pro.png',
        //     uri: '/oppo/3',
        //     price: '8.490.000'
        // }, {
        //     name: 'Xiaomi Redmi Note 7',
        //     image: '/images/xiaomi.jpg',
        //     uri: '/xiaomi/1',
        //     price: '4.090.000'
        // }]
    };
    const rawHotItems = await productModel.getHotItems();
    const rawTopBrands = await brandModel.getTopList();
    if (rawTopBrands) {
        rawTopBrands.forEach((item, index) => item.delay = index * 100);
        data.topBrand = rawTopBrands;
    }
    if (rawHotItems)
        data.hotItems = rawHotItems.map(item => {
            const newitem = parseData(item);
            newitem.uri = '/' + newitem.brand.toLowerCase() + '/' + newitem._id;
            return newitem;
        });
    res.render('index', {
        title: 'Trang chủ',
        data,
    });
};

exports.loginGet = (req, res) => {
    res.render('authen/login', { title: 'Đăng nhập' })
};

exports.recoverGet = (req, res) => {
    res.render('authen/recover', { title: 'Quên mật khẩu' })
};

exports.registerGet = (req, res) => {
    res.render('authen/register', { title: 'Đăng ký' })
};