const orderModel = require('../models/order');
const productModel = require('../models/product');
const brandModel = require('../models/brand');
const { formatPrice, getCartCount } = require('../global');

exports.home = (req, res) => {
    if (!req.session.products)
        return res.redirect('/');
    if (!req.user.active)
        return res.render('authen/disableuser', { title: 'Lỗi tài khoản', message: 'Tài khoản của bạn chưa được kích hoạt. Vui lòng kích hoạt tài khoản của bạn để đặt hàng.', cartCount: getCartCount(req), user: req.user});
    res.render('checkout/index', { title: 'Thanh toán', cartCount: getCartCount(req), data: req.session.cart.data, sum: formatPrice(req.session.cart.sum), user: req.user });
};

// exports.done = (req, res) => {
//     if (!req.session.products)
//         return res.redirect('/');
//     delete req.session.products;
//     delete req.session.cartCount;
//     delete req.session.cart;
//     res.render('checkout/done', { user: req.user, title: 'Đặt hàng thành công' });
// };

exports.submitOrder = async (req, res) => {
    if (!req.session.products)
        return res.redirect('/');
    const data = req.body;
    data.userID = req.user._id;
    data.items = req.session.products.map(element => {
        const item = {};
        item.productID = element.id;
        item.color = element.color;
        item.count = element.count;
        return item;
    });
    for (let i = 0; i < data.items.length; i++) {
        const productInfo = await productModel.info(data.items[i].productID);
        await productModel.increaseSold(data.items[i].productID, data.items[i].count);
        await brandModel.setSoldAndRevenue(productInfo.brand, data.items[i].count, productInfo.price);
    }
    data.create = new Date();
    data.price = req.session.cart.sum;
    data.status = 0;
    return orderModel.add(data, (error) => {
        if (error)
            return res.status(500).send(eror);
        delete req.session.products;
        delete req.session.cartCount;
        delete req.session.cart;
        return res.render('checkout/done', { user: req.user, title: 'Đặt hàng thành công' });
    });
};