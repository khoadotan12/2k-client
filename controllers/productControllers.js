const productModel = require('../models/product');
const createError = require('http-errors');
const { formatPrice } = require('../global');

function parseData(raw) {
    const data = { ...raw._doc };
    data.price = formatPrice(data.price);
    data.info.sim = data.info.sim.toString();
    data.info.RAM = data.info.RAM.toString() + ' GB';
    data.info.ROM = data.info.ROM.toString() + ' GB';
    data.info.PIN = data.info.PIN.toString() + ' mAh';
    data.info.Screen = data.info.Screen.toString() + ' inches';
    return data;
}
exports.home = (req, res, next) => {
    const ram = [
        {
            size: '8 GB',
            count: '19',
        }, {
            size: '6 GB',
            count: '22',
        }, {
            size: '4 GB',
            count: '71',
        }, {
            size: '2 GB',
            count: '61',
        }];
    const color = {
        black: '41',
        yellow: '10',
        blue: '30',
        red: '22',
    }
    const data = {
        brands: [{
            name: 'samsung',
            count: '162',
        }, {
            name: 'apple',
            count: '33',
        }, {
            name: 'xiaomi',
            count: '190'
        }],
        items: [{
            image: '/images/apple.png',
            name: 'Apple iPhone X 64 GB',
            info: 'Hàng chính hãng',
            price: '20,790,000',
            uri: 'apple/2',
        }, {
            image: '/images/iphoneXSMax.png',
            name: 'Apple iPhone XS Max 128 GB',
            info: 'Hàng chính hãng',
            price: '30,790,000',
            uri: 'apple/6',
        }, {
            image: '/images/iphoneXSMax.png',
            name: 'Apple iPhone XS Max 64 GB',
            info: 'Hàng chính hãng',
            price: '28,790,000',
            uri: 'apple/1',
        }, {
            image: '/images/iphoneXSMax.png',
            name: 'Apple iPhone XS Max 64 GB',
            info: 'Hàng nhập khẩu',
            price: '25,290,000',
            uri: 'apple/3',
        }, {
            image: '/images/samsung.png',
            name: 'Samsung Galaxy S10+',
            info: 'Hàng chính hãng',
            price: '21,390,000',
            uri: 'samsung/4',
        }, {
            image: '/images/oppof11pro.png',
            name: 'Oppo F11 Pro',
            info: 'Hàng chính hãng',
            price: '12,390,000',
            uri: 'oppo/1',
        }, {
            image: '/images/samsung.png',
            name: 'Samsung Galaxy S10+',
            info: 'Hàng nhập khẩu',
            price: '17,990,000',
            uri: 'samsung/5',
        }, {
            image: '/images/xiaomi.jpg',
            name: 'Xiaomi Redmi Note 7',
            info: 'Hàng chính hãng',
            price: '8,390,000',
            uri: 'xiaomi/1',
        }]
    };
    data.ram = ram;
    data.color = color;
    res.render('product/all', { title: 'Cửa hàng', data });
};

exports.info = async (req, res, next) => {
    const rawdata = await productModel.info(req.params.id);
    if (!rawdata)
        return next(createError(404));
    const data = parseData(rawdata);
    res.render('product/info', { title: data.name, data })
};

exports.search = (req, res, next) => {
    const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo'];
    const ram = ['8 GB',
        '6 GB',
        '4 GB',
        '2 GB',
    ];
    const data = {

    }
    data.brands = brands;
    data.ram = ram;
    res.render('product/search', { title: 'Tìm kiếm', data });
};