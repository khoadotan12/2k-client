const productModel = require('../models/product');

const { formatPrice, URL, getCartCount } = require('../global');

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
        if (req.isAuthenticated()) {
            // delete req.session.products;
            req.session.cart = { data, sum };
        }
        return res.render('cart/index', { cartCount: getCartCount(req), user: req.user, title: 'Giỏ hàng', data, sum: formatPrice(sum) })
    }
    return res.render('cart/index', { user: req.user, title: 'Giỏ hàng' })
};

exports.addCart = (req, res, next) => {
    const data = req.body;
    let products = req.session.products ? req.session.products : [];
    let cartCount = req.session.cartCount ? req.session.cartCount : 0;
    const found = products.find(element => {
        return (element.id === data.id && data.color === element.color);
    });
    if (found)
        found.count += data.count;
    else
        products.push(data);
    cartCount += data.count;
    req.session.products = products;
    req.session.cartCount = cartCount;
    res.status(200).send();
};

exports.deleteItem = (req, res, next) => {
    const data = req.body;
    let products = req.session.products;
    let cartCount = req.session.cartCount;
    if (!products)
        return res.status(400).send('Request không hợp lệ');
    const filter = products.filter(element => {
        if (element.id === data.id && data.color === element.color)
            cartCount -= element.count;
        return (element.id !== data.id && data.color !== element.color);
    });
    req.session.products = filter;
    req.session.cartCount = cartCount;
    res.status(200).send();
};