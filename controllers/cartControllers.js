const productModel = require('../models/product');
const brandModel = require('../models/brand');

const { formatPrice, URL, getCartCount } = require('../global');

exports.index = async (req, res, next) => {
    const cart = req.session.products;
    let sum = 0;
    if (cart) {
        const arraydata = cart.map(async (element) => {
            const product = await productModel.info(element.id);
            const brand = await brandModel.query(product.brand);
            element.price = formatPrice(product.price);
            element.total = formatPrice(product.price * element.count);
            element.name = product.name;
            element.image = URL + product.image;
            if (brand)
                element.uri = '/product/' + brand.name.toLowerCase() + '/' + element.id;
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

exports.deleteItem = (req, res) => {
    const data = req.body;
    let products = req.session.products;
    let cartCount = req.session.cartCount;
    if (!products)
        return res.status(400).send('Request không hợp lệ');
    const filter = products.filter(element => {
        if (element.id === data.id && data.color === element.color)
            cartCount -= element.count;
        return (element.id !== data.id || data.color !== element.color);
    });
    req.session.products = filter;
    req.session.cartCount = cartCount;
    res.status(200).send();
};

exports.updateCart = (req, res) => {
    const values = req.body.values;
    if (!values)
        return res.status(400).send('Request không hợp lệ');
    if (!values.length)
        return res.status(400).send('Request không hợp lệ');
    let products = req.session.products;
    let cartCount = 0;
    if (!products)
        return res.status(400).send('Request không hợp lệ');
    const newProducts = products.map((element, index) => {
        if (values[index] !== undefined || values[index] !== null) {
            element.count = values[index];
            cartCount += values[index];
        }
        else
            cartCount += element.count;
        return element;
    }).filter(element => element.count > 0);
    req.session.products = newProducts.filter(element => element.count > 0);
    req.session.cartCount = cartCount;
    return res.status(200).send();
};