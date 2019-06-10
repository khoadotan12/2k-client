const productModel = require('../models/product');

const { formatPrice, URL } = require('../global');

exports.index = async (req, res, next) => {
    const cart = req.session.products;
    let sum = 0;
    if (cart) {
        const arraydata = cart.map(async (element) => {
            const product = await productModel.info(element.id);
            element.price = formatPrice(product.price);
            element.total = formatPrice(product.price * element.count);
            element.name = product.name;
            element.image = URL + product.image;
            sum += product.price * element.count;
            return element;
        });
        const data = await Promise.all(arraydata);
        return res.render('cart/index', { user: req.user, title: 'Giỏ hàng', data, sum: formatPrice(sum) })
    }
    // const price = [4990000, 26590000];
    // const data = [{
    //     name: 'Xiaomi Redmi Note 7',
    //     price: formatPrice(price[0]),
    //     image: '/images/xiaomi.jpg',
    //     count: 1,
    // }, {
    //     name: 'iPhone XS Max 64 GB',
    //     price: formatPrice(price[1]),
    //     image: 'images/iphoneXSMax.png',
    //     count: 2,
    // }];
    // data.forEach((element, index) => {
    //     element.total = formatPrice(price[index] * element.count);
    //     sum += (price[index] * element.count);
    // });
    return res.render('cart/index', { user: req.user, title: 'Giỏ hàng' })
};

exports.addCart = (req, res, next) => {
    const data = req.body;
    let products = req.session.products ? req.session.products : [];
    const found = products.find(element => {
        return (element.id === data.id && data.color === element.color);
    });
    if (found)
        found.count += data.count;
    else
        products.push(data);
    req.session.products = products;
    res.status(200).send();
};