const productModel = require('../models/product');
const brandModel = require('../models/brand');
const userModel = require('../models/user');
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
    };
    const rawHotItems = await productModel.getHotItems();
    const rawTopBrands = await brandModel.getTopList();
    if (rawTopBrands) {
        rawTopBrands.forEach((item, index) => {
            item.delay = index * 100;
            item.uri = '/product/' + item.name.toLowerCase();
        });
        data.topBrand = rawTopBrands;
    }
    if (rawHotItems)
        data.hotItems = rawHotItems.map(item => {
            const newitem = parseData(item);
            newitem.uri = '/' + newitem.brand.toLowerCase() + '/' + newitem._id;
            return newitem;
        });
    let loggedIn = false;
    if (req.user)
        loggedIn = true;
    res.render('index', {
        title: 'Trang chủ',
        data,
        loggedIn,
    });
};

exports.loginGet = (req, res) => {
    res.render('authen/login', { title: 'Đăng nhập', message: req.flash('loginMessage') })
};

exports.recoverGet = (req, res) => {
    res.render('authen/recover', { title: 'Quên mật khẩu' })
};

exports.registerGet = (req, res) => {
    res.render('authen/register', { title: 'Đăng ký' })
};

exports.verifyEmail = async (req, res) => {
    const user = await userModel.getEmail(req.body.email);
    if (user)
        return res.send("Email đã được sử dụng.");
    return res.status(200).send();
}